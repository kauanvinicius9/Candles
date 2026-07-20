package com.reviva.candleshop.service;

import org.springframework.stereotype.Service;
import com.reviva.candleshop.model.PaymentLog;
import com.reviva.candleshop.repository.PaymentLogRepository;

@Service
public class PaymentLogService {

    private final PaymentLogRepository repository;
    public PaymentLogService(PaymentLogRepository repository){
        this.repository = repository;
    }

    public void save(String mercadoPagoId, String status, String event){
        
        PaymentLog log = new PaymentLog();
        log.setMercadoPagoId(mercadoPagoId);
        log.setStatus(status);
        log.setEvent(event);
        repository.save(log);
    }
}