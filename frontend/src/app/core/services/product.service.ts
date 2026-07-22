import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Product } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly products: Product[] = [
    {
      id: 1,
      name: 'Sugar Berry',
      category: 'vela',
      fragrance: 'Creme de morango',
      description: 'Vela de creme de morango com delicados morangos por cima. Peça decorativa.',
      price: 69.9,
      imagePlaceholder: 'assets/produtos/vela-ambar-baunilha.jpg',
    },
    {
      id: 2,
      name: 'Nossa Senhora Aparecida',
      category: 'vela',
      fragrance: 'Essência de Lavanda',
      description: 'Calma e Aconchego para momentos de oração.',
      price: 64.9,
      imagePlaceholder: 'assets/produtos/vela-lavanda-camomila.jpg',
    },
    // {
    //   id: 4,
    //   name: 'Home Spray Flor de Laranjeira',
    //   category: 'home-spray',
    //   fragrance: 'Flor de laranjeira e jasmim',
    //   description: 'Perfume de ambiente floral e cítrico, borrifado em segundos deixa a casa perfumada por horas.',
    //   price: 49.9,
    //   imagePlaceholder: 'assets/produtos/spray-flor-laranjeira.jpg',
    //   volumeMl: 250
    // },
    // {
    //   id: 5,
    //   name: 'Home Spray Chá Verde & Gengibre',
    //   category: 'home-spray',
    //   fragrance: 'Aroma de Leve e fresca',
    //   description: 'Nota fresca e energizante, perfeita para cozinhas e áreas sociais.',
    //   price: 10.0,
    //   imagePlaceholder: 'assets/produtos/spray-cha-verde-gengibre.jpg',
    //   volumeMl: 250
    // },
    {
      id: 6,
      name: 'Difusor para Carro - Aroma Bambu',
      category: 'difusor',
      fragrance: 'Bambu',
      description: 'Difusor para carro com uma leve fragrância de bambu.',
      price: 10.0,
      imagePlaceholder: 'assets/produtos/difusor-baunilha-tonka.jpg',
    },
    {
      id: 7,
      name: 'Difusor P + Pastilhas + 4 Velas Rechaud',
      category: 'difusor',
      fragrance: 'Essência de Lavanda',
      description: 'Essência de lavanda, perfume que acalma.',
      price: 52.90,
      imagePlaceholder: 'assets/produtos/difusor-rosas-pimenta.jpg',
    },
    {
      id: 8,
      name: 'Vela Entretempos',
      category: 'vela',
      fragrance: 'Pistache, Lavanda ou Chá Branco',
      description: 'Tampa de madeira, 160 gramas, fragrância de sua escolha.',
      price: 36.90,
      imagePlaceholder: 'assets/produtos/vela-cafe-caramelo.jpg',
    }
  ];

  getAll(): Observable<Product[]> {
    return of(this.products);
  }

  getById(id: number): Observable<Product | undefined> {
    return of(this.products.find((product) => product.id === id));
  }
}
