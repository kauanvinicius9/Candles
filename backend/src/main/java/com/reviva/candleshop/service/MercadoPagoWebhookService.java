package com.reviva.candleshop.service;

import com.mercadopago.resources.payment.Payment;
import org.springframework.stereotype.Service;

import java.util.concurrent.ConcurrentHashMap;

@Service
public class MercadoPagoWebhookService {
    private final PaymentLogService paymentLogService;
    private final MercadoPagoService mercadoPagoService;

    private final ConcurrentHashMap<String, Boolean> processedPayments = new ConcurrentHashMap<>();

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

            String status = payment.getStatus();
            String externalRef = payment.getExternalReference();
            Double amountPaid = payment.getTransactionAmount();

            paymentLogService.save(
                    String.valueOf(payment.getId()),
                    status,
                    "PAYMENT_WEBHOOK"
            );

            if ("approved".equals(status)) {
                System.out.println("Pagamento aprovado com segurança para a referência: " + externalRef);
                System.out.println("Valor recebido: R$ " + amountPaid);
                processedPayments.put(dataId, true);
            }
        } catch (Exception exception) {
            throw new RuntimeException(
                    "Erro ao processar webhook Mercado Pago",
                    exception
            );
        }
    }
}