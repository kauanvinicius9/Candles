package com.reviva.candleshop.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.reviva.candleshop.model.PaymentLog;

public interface PaymentLogRepository 
    extends JpaRepository<PaymentLog, Long>{

}