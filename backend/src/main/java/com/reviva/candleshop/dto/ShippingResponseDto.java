package com.reviva.candleshop.dto;

import java.math.BigDecimal;

public class ShippingResponseDto {
    private BigDecimal shipping;
    private BigDecimal total;

    public ShippingResponseDto(BigDecimal shipping, BigDecimal total) {
        this.shipping = shipping;
        this.total = total;
    }

    public BigDecimal getShipping() {
        return shipping;
    }

    public BigDecimal getTotal() {
        return total;
    }
}