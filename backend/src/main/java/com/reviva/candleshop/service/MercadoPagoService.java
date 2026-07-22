package com.reviva.candleshop.service;

import java.time.OffsetDateTime;

import org.springframework.stereotype.Service;

import com.mercadopago.client.payment.PaymentClient;
import com.mercadopago.client.payment.PaymentCreateRequest;
import com.mercadopago.client.payment.PaymentPayerRequest;
import com.mercadopago.resources.payment.Payment;
import com.reviva.candleshop.model.Order;

@Service
public class MercadoPagoService {

    public Payment getPayment(String id) throws Exception {
        PaymentClient client = new PaymentClient();
        return client.get(Long.valueOf(id));
    }

    public Payment createPixPayment(Order order) throws Exception {
        PaymentClient client = new PaymentClient();

        PaymentPayerRequest payer =
                PaymentPayerRequest.builder()
                        .email(order.getCustomer().getEmail())
                        .firstName(order.getCustomer().getName())
                        .build();

        PaymentCreateRequest request =
                PaymentCreateRequest.builder()
                        .transactionAmount(order.getTotalAmount())
                        .description("Pedido Reviva Velas #" + order.getId())
                        .paymentMethodId("pix")
                        .payer(payer)
                        .dateOfExpiration(
                                OffsetDateTime.now().plusMinutes(30)
                        )
                        .build();

        return client.create(request);
    }

    public String getPixQrCode(Payment payment) {

        if (payment.getPointOfInteraction() == null)
            return null;

        return payment
                .getPointOfInteraction()
                .getTransactionData()
                .getQrCode();
    }

    public String getPixQrCodeBase64(Payment payment) {

        if (payment.getPointOfInteraction() == null) {
            return null;
        }

        return payment
                .getPointOfInteraction()
                .getTransactionData()
                .getQrCodeBase64();
    }

    public String getPixTicketUrl(Payment payment) {

        if (payment.getPointOfInteraction() == null) {
            return null;
        }

        return payment
                .getPointOfInteraction()
                .getTransactionData()
                .getTicketUrl();
    }
}