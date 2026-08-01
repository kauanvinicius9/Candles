package com.reviva.candleshop.service;

import org.springframework.stereotype.Service;

import com.mercadopago.client.payment.PaymentClient;
import com.mercadopago.client.payment.PaymentCreateRequest;
import com.mercadopago.client.payment.PaymentPayerRequest;
import com.mercadopago.resources.payment.Payment;
import com.reviva.candleshop.dto.CardPaymentRequestDto;

@Service
public class CardPaymentService {
    public Payment createPayment(CardPaymentRequestDto dto) {
        try {
            String issuerId = dto.getIssuerId() != null && !dto.getIssuerId().isBlank()
                    ? dto.getIssuerId()
                    : null;

            PaymentClient client = new PaymentClient();
            PaymentPayerRequest payer = PaymentPayerRequest.builder()
                    .firstName(dto.getCustomerName())
                    .email(dto.getCustomerEmail())
                    .build();

            PaymentCreateRequest request = PaymentCreateRequest.builder()
                    .transactionAmount(dto.getTotalAmount())
                    .token(dto.getToken())
                    .paymentMethodId(dto.getPaymentMethodId())
                    .issuerId(issuerId)
                    .installments(
                            "credit_card".equals(dto.getPaymentTypeId())
                                    ? dto.getInstallments()
                                    : 1)
                    .description("Compra Reviva Velas")
                    .payer(payer)
                    .build();

            return client.create(request);

        } catch (Exception e) {
            throw new RuntimeException("Erro ao processar pagamento", e);
        }
    }
}