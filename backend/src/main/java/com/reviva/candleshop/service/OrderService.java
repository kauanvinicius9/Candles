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
            totalWeight = totalWeight.add(item.getWeight().multiply(quantity));
        }

        BigDecimal shipping = freightService.calculate(requestDto.getCustomer().getState(), totalWeight);
        BigDecimal total = subtotal.add(shipping);

        String paymentMethodStr = requestDto.getPaymentMethod() != null ? requestDto.getPaymentMethod().toString() : "";

        Payment payment

        if ("PIX".equalsIgnoreCase(requestDto.getPaymentMethod())) {
            payment = mercadoPagoService.createPixPayment(request.Dto, total);
        } else {
            payment = mercadoPagoService.createCardPayment(requestDto, total);
        }

        return new OrderResponseDto(
                payment.getId(),
                payment.getStatus() != null ? payment.getStatus() : "PENDENTE",
                requestDto.getPaymentMethod()
        );
    }
}