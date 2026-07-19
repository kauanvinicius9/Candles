export interface ShippingRequest {
    state: String;
    subtotal: number;
}

export interface ShippingResponse {
    shipping: number;
    total: number;
}