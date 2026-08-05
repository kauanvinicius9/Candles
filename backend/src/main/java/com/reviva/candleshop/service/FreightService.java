package com.reviva.candleshop.service;

import java.math.BigDecimal;
import org.springframework.stereotype.Service;

@Service
public class FreightService {
    public BigDecimal calculate(BigDecimal totalWeightG){
        if (totalWeightG.compareTo(new BigDecimal("1")) <= 0) {
            return new BigDecimal("10.00");
        }

        if (totalWeightG.compareTo(new BigDecimal("3")) <= 0) {
            return new BigDecimal("18.00");
        }

        if (totalWeightG.compareTo(new BigDecimal("5")) <= 0) {
            return new BigDecimal("25.00");
        }

        return  new BigDecimal("35.00");
    }
}