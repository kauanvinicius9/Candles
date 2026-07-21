import { Component, Input } from '@angular/core';
import { Product } from '../../core/models/product.model';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss'
})

export class ProductCardComponent {
  @Input({ required: true }) product!: Product;

  justAdded = false;

  constructor(private readonly cartService: CartService) {}

  addToCart(): void {
    this.cartService.addToCart(this.product, 1);
    this.justAdded = true;
    setTimeout(() => (this.justAdded = false), 1500);
  }

  get categoryLabel(): string {
    const labels: Record<string, string> = {
      vela: 'Vela',
      'home-spray': 'Home Spray',
      difusor: 'Difusor'
    };
    return labels[this.product.category] ?? this.product.category;
  }
}
