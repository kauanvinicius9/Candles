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
    private final EmailService emailService;
    private final FreightService freightService;


    public OrderService(
            MercadoPagoService mercadoPagoService,
            EmailService emailService,
            FreightService freightService
    ) {
        this.mercadoPagoService = mercadoPagoService;
        this.emailService = emailService;
        this.freightService = freightService;
    }


    public OrderResponseDto createOrder(OrderRequestDto requestDto) {

        BigDecimal subtotal = BigDecimal.ZERO;
        BigDecimal totalWeight = BigDecimal.ZERO;


        for (OrderItemDto item : requestDto.getItems()) {

            BigDecimal quantity =
                    BigDecimal.valueOf(item.getQuantity());


            subtotal = subtotal.add(
                    item.getPrice()
                    .multiply(quantity)
            );


            totalWeight = totalWeight.add(
                    item.getWeight()
                    .multiply(quantity)
            );
        }


        BigDecimal shipping =
                freightService.calculate(totalWeight);


        BigDecimal total =
                subtotal.add(shipping);


        Payment payment =
                mercadoPagoService.createPayment(
                        requestDto,
                        total
                );


        emailService.sendOrderNotification(
                requestDto
        );


        return new OrderResponseDto(
                String.valueOf(payment.getId()),
                "PENDENTE"
        );
    }
}