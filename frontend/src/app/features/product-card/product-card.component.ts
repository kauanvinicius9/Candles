import { Component, Input, signal } from '@angular/core';
import { Product } from '../../core/models/product.model';
import { ConfirmationModalComponent } from '../../confirmation-modal.component';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [ConfirmationModalComponent],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss'
})
export class ProductCardComponent {
  @Input({ required: true }) product!: Product;

  readonly showConfirmModal = signal<boolean>(false);
  private readonly whatsappNumber = '5519999582649'; 
  get categoryLabel(): string {
    const labels: Record<string, string> = {
      vela: 'Vela',
      'home-spray': 'Home Spray',
      difusor: 'Difusor'
    };
    return labels[this.product.category] ?? this.product.category;
  }

  openModal(): void {
    this.showConfirmModal.set(true);
  }

  handleCancel(): void {
    this.showConfirmModal.set(false);
  }

  handleConfirm(): void {
    this.showConfirmModal.set(false);
    this.redirectToWhatsApp();
  }

  private redirectToWhatsApp(): void {
    const formattedPrice = this.product.price.toFixed(2).replace('.', ',');

    const text = `Olá! Gostaria de comprar o produto *${this.product.name}* (R$ ${formattedPrice}). Pode me ajudar?`;
    const whatsappUrl = `https://wa.me/${this.whatsappNumber}?text=${encodeURIComponent(text)}`;

    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  }
}