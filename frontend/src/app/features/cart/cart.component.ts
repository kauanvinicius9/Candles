import { Component } from '@angular/core';
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

  increase(item: CartItem): void {
    this.cartService.updateQuantity(item.product.id, item.quantity + 1);
  }

  decrease(item: CartItem): void {
    this.cartService.updateQuantity(item.product.id, item.quantity - 1);
  }

  remove(item: CartItem): void {
    this.cartService.removeItem(item.product.id);
  }

  formatPrice(value: number): string {
    return value.toFixed(2).replace('.', ',');
  }
}
