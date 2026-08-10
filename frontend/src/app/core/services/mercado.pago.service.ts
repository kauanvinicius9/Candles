import { Injectable } from "@angular/core";
import { loadMercadoPago } from '@mercadopago/sdk-js';

@Injectable({
    providedIn: "root"
})
export class MercadoPagoService {
    private publickey = "chave publica aqui";
    // Colocar a chave publica real quando for subir pra produção
    
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