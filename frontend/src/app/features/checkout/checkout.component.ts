import { Component, inject, signal } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { CartService } from "../../core/services/cart.service";
import { OrderService } from "../../core/services/order.service";
import { OrderRequest, OrderResponse, PaymentMethod } from "../../core/models/order.model";
import { ShippingRequest, ShippingResponse } from "../../core/models/shipping.model";
import { MercadoPagoService } from "../../core/services/mercado.pago.service";
import { CardPaymentRequest } from "../../core/models/order.model";

@Component({
  selector: "app-checkout",
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: "./checkout.component.html",
  styleUrl: "./checkout.component.scss",
})
export class CheckoutComponent {
  private readonly formBuilder = inject(FormBuilder);

  private mp: any;
  private cardBrick: any;
  
  readonly cartService = inject(CartService);
  readonly isSubmitting = signal(false);
  readonly submitError = signal<string | null>(null);
  readonly submitSuccess = signal(false);
  readonly pixQrCode = signal<string | null>(null);
  readonly pixQrCodeBase64 = signal<string | null>(null);
  readonly pixTicketUrl = signal<string | null>(null);
  readonly shipping = signal(0);
  readonly orderTotal = signal(this.cartService.totalAmount());

  readonly checkoutForm = this.formBuilder.group({
    name: ["", [Validators.required, Validators.minLength(3)]],
    email: ["", [Validators.required, Validators.email]],
    phone: ["", [Validators.required]],
    address: ["", [Validators.required]],
    city: ["", [Validators.required]],
    state: ["", [Validators.required, Validators.maxLength(2)]],
    zipCode: ["", [Validators.required]],
    paymentMethod: ["PIX" as PaymentMethod, [Validators.required]],
    cardInstallments: [1],
    notes: [""],
  });

  constructor(
    private readonly orderService: OrderService,
    private readonly router: Router,
    private readonly mercadoPagoService: MercadoPagoService
  ) {

    this.initializeMercadoPago();
    this.checkoutForm.get("state")?.valueChanges.subscribe(state => {

      if (!state) {
        return;
      }

      this.calculateShipping(state);
    });

    this.checkoutForm.get("paymentMethod")?.valueChanges.subscribe(method => {
      if (method === "CREDITO" || method === "DEBITO") {
        setTimeout(() => {
          this.renderCardBrick();
        }, 100);
      }
    });
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

  private async initializeMercadoPago(): Promise<void> {
    this.mp = await this.mercadoPagoService.initialize();
  }

  formatPrice(value: number): string {
    return value.toFixed(2).replace(".", ",");
  }

  private async renderCardBrick(): Promise<void> {

      if (this.cardBrick) {
        await this.cardBrick.unmount();
      }
      await this.createCardBrick();
  }

  private sendCardPayment(
    cardData: any
  ) {
    const request: CardPaymentRequest = {
      orderId: 1,
      token: cardData.token,
      installments: this.checkoutForm.value.cardInstallments ?? 1,
      paymentMethodId: cardData.payment_method_id,
      paymentTypeId: cardData.payment_type_id,
      issuerId: cardData.issuer_id
    };

    this.orderService .payWithCard(request) .subscribe({
      next:(response)=> {
        console.log(
          "Pagamento aprovado",
          response
        );

        this.submitSuccess.set(true);
      },

      error:(error)=>{
        console.error(
          "Erro pagamento",
          error
        );
        this.submitError.set(
          "Pagamento recusado"
        );
      }
    });
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
          amount: this.orderTotal()
        },

        callbacks: {
          onSubmit:
          async (cardData:any)=>{
            this.sendCardPayment(
              cardData
            );
          },

          onError(error: any){
            console.error("Erro cartão", error);
          }
        }
      }
    );
  }

  private calculateShipping(state: string): void {
    this.orderService.calculateShipping({
      state,
      subtotal: this.cartService.totalAmount()
    }).subscribe({
      next: (response: ShippingResponse) => {
        this.shipping.set(response.shipping);
        this.orderTotal.set(response.total);
      }
    });
  }

  submitOrder(): void {
    if (this.checkoutForm.invalid || this.cartService.items().length === 0) {
      this.checkoutForm.markAllAsTouched();
      return;
    }

    const formValue = this.checkoutForm.getRawValue();

    const order: OrderRequest = {
      customer: {
        name: formValue.name ?? "",
        email: formValue.email ?? "",
        phone: formValue.phone ?? "",
        address: formValue.address ?? "",
        city: formValue.city ?? "",
        state: formValue.state ?? "",
        zipCode: formValue.zipCode ?? "",
      },
      
      items: this.cartService.items(),
      paymentMethod: formValue.paymentMethod ?? "PIX",
      totalAmount: this.orderTotal(),
      cardInstallments: this.isCardPayment
        ? (formValue.cardInstallments ?? 1)
        : undefined,
      notes: formValue.notes ?? "",
    };

    this.isSubmitting.set(true);
    this.submitError.set(null);

    this.orderService.submitOrder(order).subscribe({
      next: (response: OrderResponse) => {
        this.isSubmitting.set(false);
        this.submitSuccess.set(true);
        this.cartService.clearCart();

        if (response.paymentMethod === "PIX") {
          this.pixQrCode.set(
            response.pixQrCode ?? null
          );

          this.pixQrCodeBase64.set(
            response.pixQrCodeBase64 ?? null
          );

          this.pixTicketUrl.set(
            response.pixTicketUrl ?? null
          );
        }

        setTimeout(() => {
          this.submitSuccess.set(false);
        }, 3000);
      },

      error: (error: any) => {
        this.isSubmitting.set(false);
        this.submitError.set(
          "Não foi possível enviar seu pedido agora. Tente novamente em alguns instantes.",
        );
        console.error("Não foi possível enviar seu pedido agora. Tente novamente em alguns instantes.", error);

        setTimeout(() => {
          this.submitError.set(null);
        }, 3000)
      },
    });
  }
}
