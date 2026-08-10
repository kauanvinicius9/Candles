export interface ShippingRequest {
  state: string;
  items?: ShippingItemRequest[];
  subtotal?: number;
  totalWeightG?: number;
  totalVolumML?: number;
}

export interface ShippingItemRequest {
  productId: number;
  quantity: number;
}

export interface ShippingResponse {
  shipping: number;
  total: number;
}