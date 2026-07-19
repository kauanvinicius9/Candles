package com.reviva.candleshop.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import com.reviva.candleshop.model.Order;
import com.reviva.candleshop.model.OrderItem;

import java.time.format.DateTimeFormatter;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${loja.email.destino}")
    private String destinationEmail;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendOrderNotification(Order order) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(destinationEmail);
        message.setSubject("Novo pedido recebido #" + order.getId());
        message.setText(buildOrderSummary(order));
        mailSender.send(message);
    }

    private String buildOrderSummary(Order order) {
        StringBuilder summary = new StringBuilder();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

        summary.append("Novo pedido - Reviva | Velas & Aromas\n\n");
        summary.append("Pedido: #").append(order.getId()).append("\n");
        summary.append("Data: ").append(order.getCreatedAt().format(formatter)).append("\n\n");

        summary.append("Dados do cliente\n");
        summary.append("Nome: ").append(order.getCustomer().getName()).append("\n");
        summary.append("E-mail: ").append(order.getCustomer().getEmail()).append("\n");
        summary.append("Telefone: ").append(order.getCustomer().getPhone()).append("\n");
        summary.append("Endereco: ").append(order.getCustomer().getAddress())
                .append(", ").append(order.getCustomer().getCity())
                .append(" - ").append(order.getCustomer().getState())
                .append(", CEP ").append(order.getCustomer().getZipCode()).append("\n\n");

        summary.append("Itens do pedido\n");
        for (OrderItem item : order.getItems()) {
            summary.append("- ").append(item.getQuantity()).append("x ")
                    .append(item.getProduct().getName())
                    .append(" (R$ ").append(item.getUnitPrice()).append(" cada) = R$ ")
                    .append(item.getSubtotal()).append("\n");
        }

        summary.append("\nTotal: R$ ").append(order.getTotalAmount()).append("\n");
        summary.append("Forma de pagamento: ").append(order.getPaymentMethod()).append("\n");

        if (order.getCardInstallments() != null) {
            summary.append("Parcelas: ").append(order.getCardInstallments()).append("x\n");
        }

        if (order.getNotes() != null && !order.getNotes().isBlank()) {
            summary.append("Observacoes: ").append(order.getNotes()).append("\n");
        }

        summary.append("Status do pagamento: ").append(order.getStatus()).append("\n");

        return summary.toString();
    }
}
