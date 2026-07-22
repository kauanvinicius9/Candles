package com.reviva.candleshop.service;

import com.mercadopago.resources.payment.Payment;
import com.reviva.candleshop.model.Order;
import com.reviva.candleshop.model.OrderStatus;
import com.reviva.candleshop.repository.OrderRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class MercadoPagoWebhookService {
    private final OrderRepository orderRepository;
    private final PaymentLogService paymentLogService;
    private final MercadoPagoService mercadoPagoService;
    
    public MercadoPagoWebhookService(
        OrderRepository orderRepository,
        PaymentLogService paymentLogService,
        MercadoPagoService mercadoPagoService
    ) {
        this.orderRepository = orderRepository;
        this.paymentLogService = paymentLogService;
        this.mercadoPagoService = mercadoPagoService;
    }

    @Transactional
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
            String status = payment.getStatus();

            Order order = orderRepository.findByMercadoPagoId(
                String.valueOf(payment.getId())
            )
            .orElseThrow(() -> new RuntimeException("Pedido não encontrado"));

            switch (status) {
                case "approved" -> order.setStatus(OrderStatus.APROVADO);
                case "rejected" -> order.setStatus(OrderStatus.RECUSADO);
                case "cancelled" -> order.setStatus(OrderStatus.CANCELADO);
                default -> order.setStatus(OrderStatus.PENDENTE);
            }

            orderRepository.save(order);
        }  catch(Exception exception) {
            throw new RuntimeException(
                "Erro ao processar webhook Mercado Pago",
                exception
            );
        }
    }
}