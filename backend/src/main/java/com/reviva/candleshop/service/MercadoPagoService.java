package com.reviva.candleshop.service;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

import org.springframework.stereotype.Service;

import com.mercadopago.client.payment.PaymentClient;
import com.mercadopago.client.payment.PaymentCreateRequest;
import com.mercadopago.client.payment.PaymentPayerRequest;
import com.mercadopago.resources.payment.Payment;
import com.reviva.candleshop.dto.OrderRequestDto;

@Service
public class MercadoPagoService {
    public Payment getPayment(String id) throws Exception {
        PaymentClient client = new PaymentClient();
        return client.get(Long.valueOf(id));
    }

    public Payment createPixPayment(
            OrderRequestDto order,
            BigDecimal totalAmount

    ) throws Exception {
        PaymentClient client = new PaymentClient();
        PaymentPayerRequest payer =
                PaymentPayerRequest.builder()
                        .email(
                            order.getCustomer().getEmail()
                        )
                        .firstName(
                            order.getCustomer().getName()
                        )
                        .build();

        PaymentCreateRequest request =
                PaymentCreateRequest.builder()
                        .transactionAmount(totalAmount)
                        .description(
                            "Compra Reviva Velas"
                        )
                        .paymentMethodId("pix")
                        .payer(payer)
                        .dateOfExpiration(
                            OffsetDateTime.now()
                            .plusMinutes(30)
                        )
                        .build();
        return client.create(request);
    }

    public Payment createCardPayment(OrderRequestDto order, BigDecimal totalAmount) throws Exception {
        return createPixPayment(order, totalAmount);
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