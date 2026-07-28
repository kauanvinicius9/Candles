import { Component, inject, signal } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { CartService } from "../../core/services/cart.service";
import { OrderService } from "../../core/services/order.service";
import { OrderRequest, OrderResponse, PaymentMethod, CardPaymentRequest } from "../../core/models/order.model";
import { MercadoPagoService } from "../../core/services/mercado.pago.service";
import { ConfirmationModalComponent } from '../../confirmation-modal.component';

function noWhiteSpaceValidator(control: AbstractControl): ValidationErrors | null {
  const isWhiteSpace = (control.value || "").trim().length === 0;
  return !isWhiteSpace ? null : { whitespace: true };
}

@Component({
  selector: "app-checkout",
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, ConfirmationModalComponent],
  templateUrl: "./checkout.component.html",
  styleUrl: "./checkout.component.scss",
})

export class CheckoutComponent {
  private readonly formBuilder = inject(FormBuilder);
  
  private mp: any;
  private cardBrick: any;

  readonly showConfirmModal = signal<boolean>(false);
  readonly cartService = inject(CartService);
  readonly sending = signal(false);
  
  readonly submitError = signal<string | boolean | null>(null);
  readonly submitSuccess = signal(false);

  readonly pixQrCode = signal<string | null>(null);
  readonly pixQrCodeBase64 = signal<string | null>(null);
  readonly pixTicketUrl = signal<string | null>(null);

  readonly subtotal = signal(this.cartService.subtotalAmount());
  readonly shipping = signal(0);
  readonly orderTotal = signal(this.cartService.subtotalAmount());
  
  private readonly emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  private readonly phoneRegex = /^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/;
  private readonly zipCodeRegex = /^\d{5}-?\d{3}$/;
  private readonly stateRegex = /^(AC|AL|AP|AM|BA|CE|DF|ES|GO|MA|MT|MS|MG|PA|PB|PR|PE|PI|RJ|RN|RS|RO|RR|SC|SP|SE|TO)$/i;

  readonly checkoutForm = this.formBuilder.group({
    name: ["", [Validators.required, Validators.minLength(3), Validators.maxLength(100), noWhiteSpaceValidator]],
    email: ["", [Validators.required, Validators.pattern(this.emailRegex)]],
    phone: ["", [Validators.required, Validators.pattern(this.phoneRegex)]],
    address: ["", [Validators.required, Validators.minLength(5), noWhiteSpaceValidator]],
    city: ["", [Validators.required, Validators.minLength(2), noWhiteSpaceValidator]],
    state: ["", [Validators.required, Validators.pattern(this.stateRegex)]],
    zipCode: ["", [Validators.required, Validators.pattern(this.zipCodeRegex)]],
    paymentMethod: ["PIX" as PaymentMethod, [Validators.required]],
    cardInstallments: [1],
    notes: ["", [Validators.maxLength(250)]],
  });

  constructor(
    private readonly orderService: OrderService,
    private readonly router: Router,
    private readonly mercadoPagoService: MercadoPagoService,
  ) {
    this.initializeMercadoPago();
    
    this.checkoutForm.get("state")?.valueChanges.subscribe((state) => {
      if (!state || this.checkoutForm.get("state")?.invalid) return;
      this.calculateShipping(state.toUpperCase());
    });

    this.checkoutForm.get("paymentMethod")?.valueChanges.subscribe((method) => {
      if (method === "CREDITO" || method === "DEBITO") {
        setTimeout(() => {
          this.renderCardBrick();
        }, 100);
      }
    });
  }

  get f() {
    return this.checkoutForm.controls;
  }

  openModal(): void {
    if (this.checkoutForm.invalid || this.cartService.items().length === 0) {
      this.checkoutForm.markAllAsTouched();
      this.submitError.set("Preencha todos os campos corretamente.");
      setTimeout(() => this.submitError.set(null), 3000);
      return;
    }
    this.showConfirmModal.set(true);
  }

  handleConfirm(): void {
    this.showConfirmModal.set(false);
    this.submitOrder();
  }

  handleCancel(): void {
    this.showConfirmModal.set(false);
  }

  get isCardPayment(): boolean {
    return (
      this.checkoutForm.value.paymentMethod === "CREDITO" ||
      this.checkoutForm.value.paymentMethod === "DEBITO"
    );
  }

  get isCreditCard(): boolean {
    return this.checkoutForm.value.paymentMethod === "CREDITO";
  }

  formatPrice(value: number): string {
    return value.toFixed(2).replace(".", ",");
  }

  private async initializeMercadoPago(): Promise<void> {
    this.mp = await this.mercadoPagoService.initialize();
  }

  private async renderCardBrick(): Promise<void> {
    if (this.cardBrick) {
      await this.cardBrick.unmount();
    }
    await this.createCardBrick();
  }

  private async createCardBrick() {
    const bricksBuilder = this.mp.bricks();
    if (this.cardBrick) {
      await this.cardBrick.unmount();
    }

    this.cardBrick = await bricksBuilder.create(
      "cardPayment",
      "cardPaymentBrick_container",
      {
        initialization: {
          amount: this.orderTotal(),
        },
        callbacks: {
          onSubmit: async (cardData: any) => {
            if (this.checkoutForm.invalid) {
              this.checkoutForm.markAllAsTouched();
              this.submitError.set("Preencha todos os dados de entrega corretamente");
              return;
            }
            this.sendCardPayment(cardData);
          },

          onError(error: any) {
            console.error("Erro cartão", error);
          },
        },
      }
    );
  }

  private sendCardPayment(cardData: any) {
    const request: CardPaymentRequest = {
      orderId: 1,
      token: cardData.token,
      installments: this.checkoutForm.value.cardInstallments ?? 1,
      paymentMethodId: cardData.payment_method_id,
      paymentTypeId: cardData.payment_type_id,
      issuerId: cardData.issuer_id,
    };

    this.orderService.payWithCard(request).subscribe({
      next: (response) => {
        console.log("Pagamento aprovado", response);
        this.submitSuccess.set(true);
      },
      
      error: (error) => {
        console.error("Erro de pagamento", error);
        this.submitError.set("Pagamento recusado");
      },
    });
  }

  private calculateShipping(state: string): void {
    this.orderService.calculateShipping({
      state,
      items: this.cartService.items().map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
      })),
    })

    .subscribe({
      next: (response) => {
        this.shipping.set(response.shipping);
        this.orderTotal.set(response.total);
      },

      error: (error) => {
        console.error("Erro ao calcular frete", error);
      },
    });
  }

  submitOrder(): void {
    if (this.checkoutForm.invalid || this.cartService.items().length === 0) {
      this.checkoutForm.markAllAsTouched();
      this.submitError.set("Preencha todos os campos corretamente");

      setTimeout(() => {
        this.submitError.set(null);
      }, 3000);
      return;
    }

    const formValue = this.checkoutForm.getRawValue();
    const order: OrderRequest = {
      customer: {
        name: formValue.name?.trim() ?? "",
        email: formValue.email?.trim() ?? "",
        phone: formValue.phone?.trim() ?? "",
        address: formValue.address?.trim() ?? "",
        city: formValue.city?.trim() ?? "",
        state: formValue.state?.trim().toUpperCase() ?? "",
        zipCode: formValue.zipCode?.trim() ?? "",
      },

      items: this.cartService.items().map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
      })),

      paymentMethod: formValue.paymentMethod ?? "PIX",
      cardInstallments: this.isCardPayment
        ? (formValue.cardInstallments ?? 1)
        : undefined,
      notes: formValue.notes?.trim() ?? "",
    };

    this.sending.set(true);
    this.submitError.set(null);

    this.orderService.submitOrder(order).subscribe({
      next: (response: OrderResponse) => {
        this.shipping.set(response.shippingAmount);
        this.orderTotal.set(response.totalAmount);
        this.sending.set(false);
        this.submitSuccess.set(true);
        this.cartService.clearCart();

        if (response.paymentMethod === "PIX") {
          this.pixQrCode.set(response.pixQrCode ?? null);
          this.pixQrCodeBase64.set(response.pixQrCodeBase64 ?? null);
          this.pixTicketUrl.set(response.pixTicketUrl ?? null);
        }

        setTimeout(() => {
          this.submitSuccess.set(false);
        }, 3000);
      },
      error: (error: any) => {
        this.sending.set(false);
        this.submitError.set(
          "Não foi possível enviar seu pedido agora. Tente novamente em alguns instantes."
        );
        console.error("Erro no submitOrder:", error);

        setTimeout(() => {
          this.submitError.set(null);
        }, 3000);
      },
    });
  }
}