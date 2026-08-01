package com.reviva.candleshop.service;

import com.mercadopago.resources.payment.Payment;
import org.springframework.stereotype.Service;

@Service
public class MercadoPagoWebhookService {
    private final PaymentLogService paymentLogService;
    private final MercadoPagoService mercadoPagoService;

    public MercadoPagoWebhookService(
            PaymentLogService paymentLogService,
            MercadoPagoService mercadoPagoService
    ) {
        this.paymentLogService = paymentLogService;
        this.mercadoPagoService = mercadoPagoService;
    }

    public void processWebhook(
            String type,
            String dataId
    ) {

        if (!"payment".equals(type) || dataId == null) {
            return;
        }

        try {
            Payment payment = mercadoPagoService.getPayment(dataId);
            paymentLogService.save(
                    String.valueOf(payment.getId()),
                    payment.getStatus(),
                    "PAYMENT_WEBHOOK"
            );
        } catch (Exception exception) {
            throw new RuntimeException(
                    "Erro ao processar webhook Mercado Pago",
                    exception
            );
        }
    }
}