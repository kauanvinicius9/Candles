import { Component, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartItem } from '../../core/models/cart-item.model';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent {
  constructor(readonly cartService: CartService) {}

  // Verifica se já atingiu o limite de Frete Grátis
  readonly isFreeShipping = computed(() => {
    return this.cartService.subtotalAmount() >= 250;
  });

  readonly freightCost = computed(() => {
    return this.isFreeShipping() ? 0 : 15.0;
  });

  readonly totalAmount = computed(() => {
    this.cartService.subtotalAmount() + this.freightCost();
  });

  increase(item: CartItem): void {
    this.cartService.updateQuantity(item.product.id, item.quantity + 1);
  }

  decrease(item: CartItem): void {
    if (item.quantity > 1) {
      this.cartService.updateQuantity(item.product.id, item.quantity - 1);
    }
  }

  remove(item: CartItem): void {
    this.cartService.removeItem(item.product.id);
  }

  formatPrice(value?: number | null): string {
    return (value ?? 0).toFixed(2).replace('.', ',');
  }
}