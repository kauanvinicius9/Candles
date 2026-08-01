import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { ProductsComponent } from './features/products/products.component';
import { CartComponent } from './features/cart/cart.component';
import { CheckoutComponent } from './features/checkout/checkout.component';
import { ContactComponent } from './features/contact/contact.component';
import { AboutProductsComponent } from './features/about/about.component';
import { checkoutGuard } from './checkout.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent, title: 'Reviva | Velas & Aromas' },
  { path: 'produtos', component: ProductsComponent, title: 'Produtos | Reviva' },
  { path: 'carrinho', component: CartComponent, title: 'Carrinho | Reviva' },

  // Rota protegida
  { path: 'checkout', component: CheckoutComponent, title: 'Finalizar Compra | Reviva', canActivate: [checkoutGuard]},
  
  { path: 'contato', component: ContactComponent, title: 'Contato | Reviva' },
  { path: 'sobre', component: AboutProductsComponent, title: 'Sobre | Reviva' },
  { path: '**', redirectTo: '' }
];
