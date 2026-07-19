package com.reviva.candleshop.service;

import com.mercadopago.client.payment.PaymentClient;
import com.mercadopago.client.payment.PaymentCreateRequest;
import com.mercadopago.client.payment.PaymentPayerRequest;
import com.mercadopago.resources.payment.Payment;
import com.reviva.candleshop.model.Order;
import com.reviva.candleshop.model.PaymentMethod;

import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public class MercadoPagoService {

    public Payment createPayment(Order order) throws Exception {
        PaymentClient client = new PaymentClient();

        PaymentPayerRequest payer = PaymentPayerRequest.builder()
                .email(order.getCustomer().getEmail())
                .firstName(order.getCustomer().getName())
                .build();

        PaymentCreateRequest.PaymentCreateRequestBuilder requestBuilder = PaymentCreateRequest.builder()
                .transactionAmount(order.getTotalAmount())
                .description("Pedido Reviva Velas & Aromas #" + order.getId())
                .payer(payer)
                .installments(resolveInstallments(order))
                .paymentMethodId(resolvePaymentMethodId(order.getPaymentMethod()));

        return client.create(requestBuilder.build());
    }

    private Integer resolveInstallments(Order order) {
        if (order.getPaymentMethod() == PaymentMethod.CREDITO && order.getCardInstallments() != null) {
            return order.getCardInstallments();
        }
        return 1;
    }

    private String resolvePaymentMethodId(PaymentMethod paymentMethod) {
        return switch (paymentMethod) {
            case PIX -> "pix";
            case CREDITO -> "master";
            case DEBITO -> "debmaster";
        };
    }

    public BigDecimal roundedAmount(BigDecimal amount) {
        return amount.setScale(2, java.math.RoundingMode.HALF_UP);
    }
}
