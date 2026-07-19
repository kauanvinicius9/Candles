import { Component, inject, signal } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { CartService } from "../../core/services/cart.service";
import { OrderService } from "../../core/services/order.service";
import { OrderRequest, PaymentMethod } from "../../core/models/order.model";
import { ShippingRequest, ShippingResponse } from "../../core/models/shipping.model";

@Component({
  selector: "app-checkout",
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: "./checkout.component.html",
  styleUrl: "./checkout.component.scss",
})
export class CheckoutComponent {
  private readonly formBuilder = inject(FormBuilder);
  
  readonly cartService = inject(CartService);
  readonly isSubmitting = signal(false);
  readonly submitError = signal<string | null>(null);
  readonly submitSuccess = signal(false);
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
  ) {
    this.checkoutForm.get("state")?.valueChanges.subscribe(state => {

      if (!state) {
        return;
      }
      this.calculateShipping(state);
    });
  }

  get isCardPayment(): boolean {
    return this.checkoutForm.value.paymentMethod === "CREDITO";
  }

  formatPrice(value: number): string {
    return value.toFixed(2).replace(".", ",");
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
      next: () => {
        this.isSubmitting.set(false);
        this.submitSuccess.set(true);
        this.cartService.clearCart();
      },
      error: () => {
        this.isSubmitting.set(false);
        this.submitError.set(
          "Não foi possível enviar seu pedido agora. Tente novamente em alguns instantes.",
        );
      },
    });
  }
}
