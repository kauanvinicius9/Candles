import { Injectable } from "@angular/core";
import { loadMercadoPago } from '@mercadopago/sdk-js';
import { environment } from "../../../environments/environment";

@Injectable({
    providedIn: "root"
})
export class MercadoPagoService {
    private publickey = environment.mercadoPagoAccessToken;
    
    async initialize(): Promise<any> {
        await loadMercadoPago();
        const mp = new (window as any).MercadoPago(
            this.publickey,
            {
                locale: "pt-BR"
            }
        );

        return mp;
    }
}