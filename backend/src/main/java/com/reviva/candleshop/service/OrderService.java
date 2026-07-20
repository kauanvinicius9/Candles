package com.reviva.candleshop.service;

import com.mercadopago.resources.payment.Payment;
import com.reviva.candleshop.dto.CustomerDto;
import com.reviva.candleshop.dto.OrderItemDto;
import com.reviva.candleshop.dto.OrderRequestDto;
import com.reviva.candleshop.dto.OrderResponseDto;
import com.reviva.candleshop.model.Customer;
import com.reviva.candleshop.model.Order;
import com.reviva.candleshop.model.OrderItem;
import com.reviva.candleshop.model.OrderStatus;
import com.reviva.candleshop.model.PaymentMethod;
import com.reviva.candleshop.model.Product;
import com.reviva.candleshop.repository.OrderRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@Service
public class OrderService {

    private String pixQrCode;
    private String pixQrCodeBase64;
    private String pixTicketUrl;

    private final OrderRepository orderRepository;
    private final ProductService productService;
    private final MercadoPagoService mercadoPagoService;
    private final EmailService emailService;

    public OrderService(
            OrderRepository orderRepository,
            ProductService productService,
            MercadoPagoService mercadoPagoService,
            EmailService emailService
    ) {
        this.orderRepository = orderRepository;
        this.productService = productService;
        this.mercadoPagoService = mercadoPagoService;
        this.emailService = emailService;
    }

    @Transactional
    public OrderResponseDto createOrder(OrderRequestDto requestDto) {
        Order order = buildOrder(requestDto);
        Order savedOrder = orderRepository.save(order);

        if (savedOrder.getPaymentMethod() == PaymentMethod.PIX) {
            createPixPayment(savedOrder);
        } else {
            processPayment(savedOrder);
        }

        emailService.sendOrderNotification(savedOrder);
        return toResponseDto(savedOrder);
    }

    private Order buildOrder(OrderRequestDto requestDto) {
        Order order = new Order();
        order.setCustomer(toCustomer(requestDto.getCustomer()));
        order.setPaymentMethod(requestDto.getPaymentMethod());
        order.setCardInstallments(requestDto.getCardInstallments());
        order.setNotes(requestDto.getNotes());

        List<OrderItem> items = new ArrayList<>();
        BigDecimal subtotal = BigDecimal.ZERO;

        for (OrderItemDto itemDto : requestDto.getItems()) {
            Product product = productService.findById(itemDto.getProductId());

            OrderItem item = new OrderItem();
            item.setOrder(order);
            item.setProduct(product);
            item.setQuantity(itemDto.getQuantity());
            item.setUnitPrice(product.getPrice());

            items.add(item);
            subtotal = subtotal.add(item.getSubtotal());
        }

        BigDecimal shipping = calculateShipping(
            requestDto.getCustomer().getState(),
            subtotal
        );

        BigDecimal total = subtotal.add(shipping);

        order.setItems(items);
        order.setSubtotalAmount(subtotal);
        order.setShippingAmount(shipping);
        order.setTotalAmount(total);
        order.setStatus(OrderStatus.PENDENTE);

        return order;
    }

    private Customer toCustomer(CustomerDto dto) {
        Customer customer = new Customer();
        customer.setName(dto.getName());
        customer.setEmail(dto.getEmail());
        customer.setPhone(dto.getPhone());
        customer.setAddress(dto.getAddress());
        customer.setCity(dto.getCity());
        customer.setState(dto.getState());
        customer.setZipCode(dto.getZipCode());
        return customer;
    }

    private void createPixPayment(Order order) {
        try {
            Payment payment = mercadoPagoService.createPixPayment(order);
            order.setMercadoPagoId(String.valueOf(payment.getId()));
            order.setStatus(OrderStatus.PENDENTE);
            pixQrCode = mercadoPagoService.getPixQrCode(payment);
            pixQrCodeBase64 = mercadoPagoService.getPixQrCodeBase64(payment);
            pixTicketUrl = mercadoPagoService.getPixTicketUrl(payment);
            orderRepository.save(order);

        } catch (Exception exception) {
            order.setStatus(OrderStatus.PENDENTE);
            orderRepository.save(order);

            throw new RuntimeException(
                "Erro ao gerar PIX",
                exception
            );
        }
    }

    private void processPayment(Order order) {
        try {
            Payment payment = mercadoPagoService.createPayment(order);
            order.setMercadoPagoId(String.valueOf(payment.getId()));
            order.setStatus(resolveStatus(payment.getStatus()));
            orderRepository.save(order);
        } catch (Exception exception) {
            order.setStatus(OrderStatus.PENDENTE);
            orderRepository.save(order);
        }
    }

    private OrderStatus resolveStatus(String mercadoPagoStatus) {
        if (mercadoPagoStatus == null) {
            return OrderStatus.PENDENTE;
        }
        return switch (mercadoPagoStatus) {
            case "approved" -> OrderStatus.APROVADO;
            case "rejected" -> OrderStatus.RECUSADO;
            case "cancelled" -> OrderStatus.CANCELADO;
            default -> OrderStatus.PENDENTE;
        };
    }

    private OrderResponseDto toResponseDto(Order order) {
        OrderResponseDto responseDto = new OrderResponseDto(
                order.getId(),
                order.getStatus().name(),
                order.getPaymentMethod()
        );

        if (order.getPaymentMethod() == PaymentMethod.PIX) {
            responseDto.setPixQrCode(pixQrCode);
            responseDto.setPixQrCodeBase64(
                pixQrCodeBase64
            );

            responseDto.setPixTicketUrl(
                pixTicketUrl
            );
        }

        return responseDto;
    }

    public BigDecimal calculateShipping(String state, BigDecimal subtotal) {

        if (subtotal.compareTo(new BigDecimal("250")) >= 0) {
            return BigDecimal.ZERO;
        }

        return switch (state.toUpperCase()) {
            case "SP" -> new BigDecimal("15.00");
            case "RJ", "MG", "ES" -> new BigDecimal("20,00");
            default -> new BigDecimal("30.00");
        };
    }
}
