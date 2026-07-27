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
      description: 'Feito com carinho, não em escala. Por serem artesanais, alguns produtos podem levar até 3 dias úteis para produção, além do prazo de entrega.',
      price: 69.9,
      imagePlaceholder: 'assets/Candle-Strawberry.jpeg',
      isNew: true,
      weightG: 10,
    },
    {
      id: 2,
      name: 'Nossa Senhora Aparecida',
      category: 'vela',
      fragrance: 'Essência de Lavanda',
      description: 'Feito com carinho, não em escala. Por serem artesanais, alguns produtos podem levar até 3 dias úteis para produção, além do prazo de entrega.',
      price: 64.9,
      imagePlaceholder: 'assets/Candle-NSA.jpeg',
      isNew: false,
      weightG: 10,
    },
    {
      id: 3,
      name: 'Difusor para Carro - Aroma Bambu',
      category: 'difusor',
      fragrance: 'Bambu',
      description: 'Feito com carinho, não em escala. Por serem artesanais, alguns produtos podem levar até 3 dias úteis para produção, além do prazo de entrega.',
      price: 10.0,
      imagePlaceholder: 'assets/Dif-Car.jpeg',
      isNew: false,
      weightG: 10,
    },
    {
      id: 4,
      name: 'Difusor P + Pastilhas + 4 Velas Rechaud',
      category: 'difusor',
      fragrance: 'Essência de Lavanda',
      description: 'Feito com carinho, não em escala. Por serem artesanais, alguns produtos podem levar até 3 dias úteis para produção, além do prazo de entrega.',
      price: 52.90,
      imagePlaceholder: 'assets/Candle-Lavanda.jpeg',
      isNew: true,
      weightG: 10,
    },
    {
      id: 5,
      name: 'Entretempos',
      category: 'vela',
      fragrance: 'Pistache, Lavanda ou Chá Branco',
      description: 'Feito com carinho, não em escala. Por serem artesanais, alguns produtos podem levar até 3 dias úteis para produção, além do prazo de entrega.',
      price: 36.90,
      imagePlaceholder: 'assets/Candle-Pistache.jpeg',
      isNew: false,
      weightG: 10,
    },
    {
      id: 6,
      name: 'Wax Melt',
      category: 'vela',
      fragrance: 'Chá Branco e Jasmine',
      description: 'Feito com carinho, não em escala. Por serem artesanais, alguns produtos podem levar até 3 dias úteis para produção, além do prazo de entrega.',
      price: 36.90,
      imagePlaceholder: 'assets/Candle-WaxMelt.jpeg',
      isNew: false,
      weightG: 10,
    },
    {
      id: 7,
      name: 'Luz de Sakura',
      category: 'home-spray',
      fragrance: 'Bambu',
      description: 'Feito com carinho, não em escala. Por serem artesanais, alguns produtos podem levar até 3 dias úteis para produção, além do prazo de entrega.',
      price: 36.90,
      imagePlaceholder: 'assets/HomeSpray-Sakura.jpeg',
      isNew: false,
      weightG: 10,
    }
  ];

  getAll(): Observable<Product[]> {
    return of(this.products);
  }

  getById(id: number): Observable<Product | undefined> {
    return of(this.products.find((product) => product.id === id));
  }
}
