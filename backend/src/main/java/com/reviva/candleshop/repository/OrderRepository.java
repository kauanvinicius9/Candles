package com.reviva.candleshop.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.reviva.candleshop.model.Order;

import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order, Long> {
    Optional<Order> findByMercadoPagoId(String mercadoPagoId);
}
