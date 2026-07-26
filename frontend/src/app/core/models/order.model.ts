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
  items: OrderItemRequest[];
  paymentMethod: PaymentMethod;
  cardInstallments?: number;
  notes?: string;
}

export interface OrderItemRequest {
  productId: number;
  quantity: number;
}

export interface OrderResponse {
  orderId: number;
  status: string;
  paymentMethod: PaymentMethod;
  pixQrCode?: string;
  pixQrCodeBase64?: string;
  pixTicketUrl?: string;
  pixCopyPaste?: string;
  paymentUrl?: string;
  subtotalAmount: number;
  shippingAmount: number;
  totalAmount: number;

}

export interface CardPaymentRequest {
    orderId: number;
    token: string;
    installments: number;
    paymentMethodId: string;
    paymentTypeId: string;
    issuerId: string;
}