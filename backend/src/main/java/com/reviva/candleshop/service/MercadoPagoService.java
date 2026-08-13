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
    @Value("${mercadopago.notification-url:https://https://www.revivavelas.com.br/api/pagamentos/webhook}")
    public String notificationUrl;
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
                        .email(order.getCustomer().getEmail())
                        .firstName(order.getCustomer().getName())
                        .build();
        
        Map<String, Object> metadata = new HashMap<>();
        metadata.put("customer_name", order.getCustomer().getName());
        metadata.put("customer_phone", order.getCustomer().getPhone());
        metadata.put("customer_address", order.getCustomer().getAddress());
        metadata.put("customer_city", order.getCustomer().getCity());
        metadata.put("customer_state", order.getCustomer().getState());
        metadata.put("customer_zip_code", order.getCustomer().getZipCode());
        metadata.put("order_notes", order.getNotes() != null ? order.getNotes() : "");

        PaymentCreateRequest request =
                PaymentCreateRequest.builder()
                        .transactionAmount(totalAmount)
                        .description("Compra Reviva Velas")
                        .paymentMethodId("pix")
                        .externalReference("PED-" + System.currentTimeMillis())
                        .notificationUrl(notificaionUrl)
                        .metadata(metadata)
                        .payer(payer)
                        .dateOfExpiration(OffsetDateTime.now().plusMinutes(30))
                        .build();

        return client.create(request);
    }

    public Payment createCardPayment(OrderRequestDto order, BigDecimal totalAmount) throws Exception {
        return createPixPayment(order, totalAmount);
    }

    public String getPixQrCode(Payment payment) {
        if (payment.getPointOfInteraction() == null) return null;
        return payment.getPointOfInteraction().getTransactionData().getQrCode();
    }

    public String getPixQrCodeBase64(Payment payment) {
        if (payment.getPointOfInteraction() == null) return null;
        return payment.getPointOfInteraction().getTransactionData().getQrCodeBase64();
    }

    public String getPixTicketUrl(Payment payment) {
        if (payment.getPointOfInteraction() == null) return null;
        return payment.getPointOfInteraction().getTransactionData().getTicketUrl();
    }
}