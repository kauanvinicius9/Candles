import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Product } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly products: Product[] = [
    {
      id: 1,
      name: 'Vela Âmbar & Baunilha',
      category: 'vela',
      fragrance: 'Âmbar, baunilha e sândalo',
      description: 'Vela artesanal em cera vegetal, ideal para criar um ambiente aconchegante nas noites frias.',
      price: 69.9,
      imagePlaceholder: 'assets/produtos/vela-ambar-baunilha.jpg',
      burnTimeHours: 40,
      volumeMl: 220
    },
    {
      id: 2,
      name: 'Vela Lavanda & Camomila',
      category: 'vela',
      fragrance: 'Lavanda, camomila e almíscar branco',
      description: 'Aroma relaxante perfeito para o quarto, feita à mão com pavio de algodão.',
      price: 64.9,
      imagePlaceholder: 'assets/produtos/vela-lavanda-camomila.jpg',
      burnTimeHours: 38,
      volumeMl: 200
    },
    {
      id: 3,
      name: 'Vela Madeira & Cedro',
      category: 'vela',
      fragrance: 'Cedro, patchouli e vetiver',
      description: 'Fragrância amadeirada e envolvente, ótima para salas de estar e escritórios.',
      price: 74.9,
      imagePlaceholder: 'assets/produtos/vela-madeira-cedro.jpg',
      burnTimeHours: 45,
      volumeMl: 240
    },
    {
      id: 4,
      name: 'Home Spray Flor de Laranjeira',
      category: 'home-spray',
      fragrance: 'Flor de laranjeira e jasmim',
      description: 'Perfume de ambiente floral e cítrico, borrifado em segundos deixa a casa perfumada por horas.',
      price: 49.9,
      imagePlaceholder: 'assets/produtos/spray-flor-laranjeira.jpg',
      volumeMl: 250
    },
    {
      id: 5,
      name: 'Home Spray Chá Verde & Gengibre',
      category: 'home-spray',
      fragrance: 'Chá verde, gengibre e limão siciliano',
      description: 'Nota fresca e energizante, perfeita para cozinhas e áreas sociais.',
      price: 49.9,
      imagePlaceholder: 'assets/produtos/spray-cha-verde-gengibre.jpg',
      volumeMl: 250
    },
    {
      id: 6,
      name: 'Difusor de Varetas Baunilha & Fava Tonka',
      category: 'difusor',
      fragrance: 'Baunilha, fava tonka e âmbar',
      description: 'Difusor de varetas com fragrância contínua por até 60 dias, sem chama e sem fumaça.',
      price: 89.9,
      imagePlaceholder: 'assets/produtos/difusor-baunilha-tonka.jpg',
      volumeMl: 180
    },
    {
      id: 7,
      name: 'Difusor de Varetas Rosas & Pimenta Rosa',
      category: 'difusor',
      fragrance: 'Rosas, pimenta rosa e musk',
      description: 'Combinação floral e picante que perfuma o ambiente de forma sutil e constante.',
      price: 89.9,
      imagePlaceholder: 'assets/produtos/difusor-rosas-pimenta.jpg',
      volumeMl: 180
    },
    {
      id: 8,
      name: 'Vela Café & Caramelo',
      category: 'vela',
      fragrance: 'Café torrado, caramelo e cacau',
      description: 'Aroma gourmand e reconfortante, uma das fragrâncias favoritas dos nossos clientes.',
      price: 69.9,
      imagePlaceholder: 'assets/produtos/vela-cafe-caramelo.jpg',
      burnTimeHours: 40,
      volumeMl: 220
    }
  ];

  getAll(): Observable<Product[]> {
    return of(this.products);
  }

  getById(id: number): Observable<Product | undefined> {
    return of(this.products.find((product) => product.id === id));
  }
}
