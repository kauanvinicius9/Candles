package com.reviva.candleshop.controller;

import java.math.BigDecimal;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RestController;

import com.reviva.candleshop.dto.OrderRequestDto;
import com.reviva.candleshop.dto.OrderResponseDto;
import com.reviva.candleshop.dto.ShippingResponseDto;
import com.reviva.candleshop.dto.ShippingRequestDto;
import com.reviva.candleshop.service.OrderService;
import com.reviva.candleshop.service.FreightService;

@RestController
@RequestMapping("/api/pedidos")
@CrossOrigin(origins = "https://www.revivavelas.com.br")
public class OrderController {
    private final OrderService orderService;
    private final FreightService freightService;

    public OrderController(OrderService orderService, FreightService freightService) {
        this.orderService = orderService;
        this.freightService = freightService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public OrderResponseDto createOrder(@Valid @RequestBody OrderRequestDto requestDto) throws Exception {
        return orderService.createOrder(requestDto);
    }

    @PostMapping("/frete")
    public ShippingResponseDto calculateShipping(@Valid @RequestBody ShippingRequestDto request) {
            BigDecimal shipping = freightService.calculate(
                request.getState(),
                request.getSubtotal()
            );

            BigDecimal total = request.getSubtotal().add(shipping);
            return new ShippingResponseDto(shipping, total);
        }
}
