package com.reviva.candleshop.service;

import org.springframework.stereotype.Service;

@Service
public class PaymentLogService {
    public void save(
            String mercadoPagoId,
            String status,
            String event
    ) {

        System.out.println("Mercado Pago ID: " + mercadoPagoId);
        System.out.println("Status: " + status);
        System.out.println("Evento: " + event);
    }
}