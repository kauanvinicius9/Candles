import { CartItem } from './cart-item.model';

export type PaymentMethod = 'CREDITO' | 'DEBITO' | 'PIX';

export interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface OrderRequest {
  customer: CustomerInfo;
  items: CartItem[];
  paymentMethod: PaymentMethod;
  totalAmount: number;
  cardInstallments?: number;
  notes?: string;
}

export interface OrderResponse {
  orderId: number;
  status: string;
  paymentMethod: PaymentMethod;
  pixQrCode?: string;
  pixCopyPaste?: string;
  paymentUrl?: string;
}
