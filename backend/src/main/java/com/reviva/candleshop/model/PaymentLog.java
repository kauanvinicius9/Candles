package com.reviva.candleshop.model;

import java.time.LocalDateTime;

public class PaymentLog{

    private Long id;
    private String mercadoPagoId;
    private String status;
    private String event;
    private LocalDateTime createdAt;

    public void prePersist(){
        createdAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public String getMercadoPagoId() {
        return mercadoPagoId;
    }

    public void setMercadoPagoId(String mercadoPagoId) {
        this.mercadoPagoId = mercadoPagoId;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getEvent() {
        return event;
    }

    public void setEvent(String event) {
        this.event = event;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}