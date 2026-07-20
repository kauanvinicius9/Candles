package com.reviva.candleshop.service;

import org.springframework.stereotype.Service;

import com.mercadopago.client.payment.PaymentClient;
import com.mercadopago.client.payment.PaymentCreateRequest;
import com.mercadopago.client.payment.PaymentPayerRequest;
import com.mercadopago.resources.payment.Payment;
import com.reviva.candleshop.dto.CardPaymentRequestDto;
import com.reviva.candleshop.model.Order;
import com.reviva.candleshop.repository.OrderRepository;

@Service
public class CardPaymentService {
    private final OrderRepository orderRepository;
    public CardPaymentService(OrderRepository orderRepository){
        this.orderRepository = orderRepository;
    }

    public Payment createPayment(CardPaymentRequestDto dto){
        try {
            Order order = orderRepository
                    .findById(dto.getOrderId())
                    .orElseThrow();

            PaymentClient client = new PaymentClient();
            PaymentPayerRequest payer =
                    PaymentPayerRequest.builder()
                    .email(order.getCustomer().getEmail())
                    .firstName(order.getCustomer().getName())
                    .build();

            PaymentCreateRequest request = PaymentCreateRequest.builder()
                    .transactionAmount(order.getTotalAmount())
                    .token(dto.getToken())
                    .installments(dto.getInstallments())
                    .paymentMethodId(dto.getPaymentMethodId())
                    .description("Pedido Reviva Velas #" + order.getId())
                    .payer(payer)
                    .build();

            Payment payment = client.create(request);
            order.setMercadoPagoId(String.valueOf(payment.getId()));
            orderRepository.save(order);
            return payment;

        } catch(Exception e){
            throw new RuntimeException("Erro ao processar cartão",e
            );
        }
    }
}