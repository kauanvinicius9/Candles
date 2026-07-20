package com.reviva.candleshop.service;

import com.mercadopago.client.payment.PaymentClient;
import com.mercadopago.resources.payment.Payment;
import com.reviva.candleshop.model.Order;
import com.reviva.candleshop.model.OrderStatus;
import com.reviva.candleshop.repository.OrderRepository;

@Service
public class MercadoPagoWebhookService {
    private final OrderRepository orderRepository;
    private final PaymentLogService paymentLogService;
    
    public MercadoPagoWebhookService(
        OrderRepository orderRepository,
        PaymentLogService paymentLogService
    ) {
        this.orderRepository = orderRepository;
        this.paymentLogService = paymentLogService;
    }

    public void processWebhook(
        String type,
        String dataId
    ) {
        if (!"payment".equals(type) || dataId == null) {
            return;
        }

        try {
            PaymentClient client = new PaymentClient();
            Payment payment = client.get(Long.valueOf(dataId));
            PaymentLogService.save(
                String.valueOf(payment.getId()),
                payment.getStatus(),
                "PAYMENT_WEBHOOK"
            );
            String status = payment.getStatus();
            Order order = orderRepository.findByMercadoPagoId(
                String.valueOf(payment.getId())
            )
            .orElse(null);

            if (order == null) {
                return;
            }

            if ("approved".equals(status)) {order.setStatus(OrderStatus.APROVADO);}

            orderRepository.save(order);
        }  catch(Exception exception) {
            throw new RuntimeException(
                "Erro ao processar webhook Mercado Pago",
                exception
            );
        }
    }
}