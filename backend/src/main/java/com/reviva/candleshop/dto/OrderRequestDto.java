package com.reviva.candleshop.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.util.List;

import com.reviva.candleshop.model.PaymentMethod;

public class OrderRequestDto {

    @Valid
    @NotNull
    private CustomerDto customer;

    @Valid
    @NotEmpty
    private List<OrderItemDto> items;

    @NotNull
    private PaymentMethod paymentMethod;

    private Integer cardInstallments;

    private String notes;

    public CustomerDto getCustomer() {
        return customer;
    }

    public void setCustomer(CustomerDto customer) {
        this.customer = customer;
    }

    public List<OrderItemDto> getItems() {
        return items;
    }

    public void setItems(List<OrderItemDto> items) {
        this.items = items;
    }

    public PaymentMethod getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(PaymentMethod paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public Integer getCardInstallments() {
        return cardInstallments;
    }

    public void setCardInstallments(Integer cardInstallments) {
        this.cardInstallments = cardInstallments;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}
