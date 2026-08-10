import { Injectable, computed, signal } from '@angular/core';
import { CartItem } from '../models/cart-item.model';
import { Product } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly itemsSignal = signal<CartItem[]>([]);

  readonly items = computed(() => this.itemsSignal());

  readonly totalItems = computed(() =>
    this.itemsSignal().reduce((sum, item) => sum + item.quantity, 0)
  );

  readonly subtotalAmount = computed(() =>
    this.itemsSignal().reduce(
      (sum, item) => sum + item.quantity * item.product.price,
      0
    )
  );

  // Soma total acumulada em Gramas
  readonly totalWeightG = computed(() =>
    this.itemsSignal().reduce(
      (sum, item) => sum + (item.product.weightG ?? 0) * item.quantity,
      0
    )
  );

  // Soma total acumulada em Mililitros
  readonly totalVolumML = computed(() =>
    this.itemsSignal().reduce(
      (sum, item) => sum + (item.product.volumML ?? 0) * item.quantity,
      0
    )
  );

  addToCart(product: Product, quantity = 1): void {
    const currentItems = this.itemsSignal();
    const existingItem = currentItems.find((item) => item.product.id === product.id);

    if (existingItem) {
      this.updateQuantity(product.id, existingItem.quantity + quantity);
      return;
    }

    this.itemsSignal.set([...currentItems, { product, quantity }]);
  }

  updateQuantity(productId: number, quantity: number): void {
    if (quantity <= 0) {
      this.removeItem(productId);
      return;
    }

    this.itemsSignal.set(
      this.itemsSignal().map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  }

  removeItem(productId: number): void {
    this.itemsSignal.set(this.itemsSignal().filter((item) => item.product.id !== productId));
  }

  clearCart(): void {
    this.itemsSignal.set([]);
  }
}