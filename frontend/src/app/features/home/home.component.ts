import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Product } from '../../core/models/product.model';
import { ProductService } from '../../core/services/product.service';
import { ProductCardComponent } from '../product-card/product-card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, ProductCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  readonly featuredProducts = signal<Product[]>([]);

  constructor(private readonly productService: ProductService) {}

  ngOnInit(): void {
    this.productService.getAll().subscribe((products) => {
      this.featuredProducts.set(products.slice(0, 4));
    });
  }
}
