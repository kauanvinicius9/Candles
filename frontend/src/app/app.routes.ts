import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { ProductsComponent } from './features/products/products.component';
import { ContactComponent } from './features/contact/contact.component';
import { AboutProductsComponent } from './features/about/about.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, title: 'Reviva | Velas & Aromas' },
  { path: 'produtos', component: ProductsComponent, title: 'Produtos | Reviva' },
  { path: 'contato', component: ContactComponent, title: 'Contato | Reviva' },
  { path: 'sobre', component: AboutProductsComponent, title: 'Sobre | Reviva' },
  { path: '**', redirectTo: '' }
];
