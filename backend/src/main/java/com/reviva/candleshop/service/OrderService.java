package com.reviva.candleshop.service;

import java.math.BigDecimal;

import org.springframework.stereotype.Service;

import com.mercadopago.resources.payment.Payment;
import com.reviva.candleshop.dto.OrderItemDto;
import com.reviva.candleshop.dto.OrderRequestDto;
import com.reviva.candleshop.dto.OrderResponseDto;

@Service
public class OrderService {
    private final MercadoPagoService mercadoPagoService;
    private final FreightService freightService;

    public OrderService(
            MercadoPagoService mercadoPagoService,
            FreightService freightService
    ) {
        this.mercadoPagoService = mercadoPagoService;
        this.freightService = freightService;
    }

    public OrderResponseDto createOrder(OrderRequestDto requestDto) throws Exception {
        BigDecimal subtotal = BigDecimal.ZERO;
        BigDecimal totalWeight = BigDecimal.ZERO;

        for (OrderItemDto item : requestDto.getItems()) {
            BigDecimal quantity = BigDecimal.valueOf(item.getQuantity());
            subtotal = subtotal.add(item.getPrice().multiply(quantity));

            BigDecimal itemWeight = item.getWeightG() != null ? item.getWeightG() : item.getVolumML();
            if (itemWeight == null) {
                itemWeight = BigDecimal.ZERO;
            }

            totalWeight = totalWeight.add(itemWeight.multiply(quantity));
        }

        BigDecimal shipping = freightService.calculate(requestDto.getCustomer().getState(), totalWeight);
        BigDecimal total = subtotal.add(shipping);

        Payment payment;

        if (requestDto.getPaymentMethod() != null && "PIX".equalsIgnoreCase(requestDto.getPaymentMethod().name())) {
            payment = mercadoPagoService.createPixPayment(requestDto, total);
        } else {
            payment = mercadoPagoService.createCardPayment(requestDto, total);
        }

        OrderResponseDto response = new OrderResponseDto(
            payment.getId(),
            payment.getStatus() != null ? payment.getStatus()  : "PENDENTE",
            requestDto.getPaymentMethod()
        );

        if ("PIX".equalsIgnoreCase(requestDto.getPaymentMethod().name())) {
            response.setPixQrCode(mercadoPagoService.getPixQrCode(payment));
            response.setPixQrCodeBase64(mercadoPagoService.getPixQrCodeBase64(payment));
            response.setPixTicketUrl(mercadoPagoService.getPixTicketUrl(payment));
        }

        return response;

        return new OrderResponseDto(
                payment.getId(),
                payment.getStatus() != null ? payment.getStatus() : "PENDENTE",
                requestDto.getPaymentMethod()
        );
    }
}