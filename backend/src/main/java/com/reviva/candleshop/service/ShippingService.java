package com.reviva.candleshop.service;

import org.springframework.stereotype.Service;
import java.math.BigDecimal;

@Service
public class ShippingService {
    public BigDecimal calculateShipping(
        String state,
        BigDecimal subtotal
    ) {

        if (subtotal.compareTo(new BigDecimal("250")) >= 0) {
            return BigDecimal.ZERO;
        }

        return switch (state.toUpperCase()) {
            case "SP" -> new BigDecimal("15.00");
            case "RJ", "MG", "ES" -> new BigDecimal("20.00");
            default -> new BigDecimal("30.00");
        };
    }
}