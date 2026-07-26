export interface ShippingRequest {
  state: string;
  items: ShippingItemRequest[];
}

export interface ShippingItemRequest {
  productId: number;
  quantity: number;
}

export interface ShippingResponse {
  shipping: number;
  total: number;
}