package com.reviva.candleshop.dto;

import com.reviva.candleshop.model.PaymentMethod;

public class OrderResponseDto {

    private Long orderId;
    private String status;
    private PaymentMethod paymentMethod;
    private String pixQrCode;
    private String pixCopyPaste;
    private String paymentUrl;

    public OrderResponseDto() {
    }

    public OrderResponseDto(Long orderId, String status, PaymentMethod paymentMethod) {
        this.orderId = orderId;
        this.status = status;
        this.paymentMethod = paymentMethod;
    }

    public Long getOrderId() {
        return orderId;
    }

    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public PaymentMethod getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(PaymentMethod paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public String getPixQrCode() {
        return pixQrCode;
    }

    public void setPixQrCode(String pixQrCode) {
        this.pixQrCode = pixQrCode;
    }

    public String getPixCopyPaste() {
        return pixCopyPaste;
    }

    public void setPixCopyPaste(String pixCopyPaste) {
        this.pixCopyPaste = pixCopyPaste;
    }

    public String getPaymentUrl() {
        return paymentUrl;
    }

    public void setPaymentUrl(String paymentUrl) {
        this.paymentUrl = paymentUrl;
    }
}
