package com.reviva.candleshop.dto;

import com.reviva.candleshop.model.PaymentMethod;

public class OrderResponseDto {
    private Long orderId;
    private String status;
    private PaymentMethod paymentMethod;
    private String pixQrCode;
    private String pixQrCodeBase64;
    private String pixCopyPaste;
    private String pixTicketUrl;
    private String paymentUrl;
    private String paymentId;

    public OrderResponseDto() {}

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

    public String getPixQrCodeBase64() {
        return pixQrCodeBase64;
    }

    public void setPixCopyPaste(String pixCopyPaste) {
        this.pixCopyPaste = pixCopyPaste;
    }

    public void setPixQrCodeBase64(String pixQrCodeBase64) {
        this.pixQrCodeBase64 = pixQrCodeBase64;
    }

    public String getPaymentUrl() {
        return paymentUrl;
    }

    public String getPixTicketUrl() {
        return pixTicketUrl;
    }

    public void setPaymentUrl(String paymentUrl) {
        this.paymentUrl = paymentUrl;
    }

    public void setPixTicketUrl(String pixTicketUrl) {
        this.pixTicketUrl = pixTicketUrl;
    }

    public String getPaymentId() {
        return paymentId;
    }

    public void setPaymentId(String paymentId) {
        this.paymentId = paymentId;
    }
}
