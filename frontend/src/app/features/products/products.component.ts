import { Component, OnInit, computed, signal } from '@angular/core';
import { Product, ProductCategory } from '../../core/models/product.model';
import { ProductService } from '../../core/services/product.service';
import { ProductCardComponent } from '../product-card/product-card.component';

type CategoryFilter = ProductCategory | 'todos';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [ProductCardComponent],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent implements OnInit {
  readonly allProducts = signal<Product[]>([]);
  readonly activeFilter = signal<CategoryFilter>('todos');

  readonly filteredProducts = computed(() => {
    const filter = this.activeFilter();
    if (filter === 'todos') {
      return this.allProducts();
    }
    return this.allProducts().filter((product) => product.category === filter);
  });

  readonly filters: { value: CategoryFilter; label: string }[] = [
    { value: 'todos', label: 'Todos' },
    { value: 'vela', label: 'Velas' },
    { value: 'home-spray', label: 'Home Sprays' },
    { value: 'difusor', label: 'Difusores' }
  ];

  constructor(private readonly productService: ProductService) {}

  ngOnInit(): void {
    this.productService.getAll().subscribe((products) => this.allProducts.set(products));
  }

  setFilter(filter: CategoryFilter): void {
    this.activeFilter.set(filter);
  }
}
