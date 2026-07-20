import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { OrderRequest, OrderResponse } from '../models/order.model';
import { ShippingRequest, ShippingResponse} from '../models/shipping.model';
import { CardPaymentRequest } from '../models/order.model';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private readonly baseUrl = `${environment.apiUrl}/pedidos`;

  constructor(private readonly http: HttpClient) {}

  submitOrder(order: OrderRequest): Observable<OrderResponse> {
    return this.http.post<OrderResponse>(this.baseUrl, order);
  }

  payWithCard(
    request: CardPaymentRequest
  ) {
    return this.http.post(
      `${environment.apiUrl}/pagamentos/cartao`,
      request
    );
  }

  calculateShipping(
    request: ShippingRequest
  ): Observable<ShippingResponse> {
    return this.http.post<ShippingResponse> (
      `${this.baseUrl}/frete`,
      request
    )
  }
}
