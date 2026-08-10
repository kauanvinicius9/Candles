import { Component, OnInit, signal } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
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

  constructor(
    private readonly productService: ProductService,
    private readonly titleService: Title,
    private readonly metaService: Meta
  ) {}

  ngOnInit(): void {
    this.titleService.setTitle("Reviva Ateliê | Velas & Aromas");
    this.metaService.updateTag({
      name: "description",
      content: "Transforme seu ambiente com a Reviva Velas. Velas aromáticas 100% artesanais, feitas com cera vegetal e essências premium. Compre online e receba em casa"
    });

    this.productService.getAll().subscribe((products) => {
      this.featuredProducts.set(products.slice(0, 4));
    });
  }
}