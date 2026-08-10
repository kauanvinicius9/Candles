package com.reviva.candleshop.service;

import java.math.BigDecimal;
import java.util.Set;
import org.springframework.stereotype.Service;

@Service
public class FreightService {

    private static final Set<String> SUDESTE = Set.of("SP", "RJ", "MG", "ES");
    private static final Set<String> SUL = Set.of("PR", "SC", "RS");
    private static final Set<String> CENTRO_OESTE = Set.of("DF", "GO", "MS", "MT");
    private static final Set<String> NORDESTE = Set.of("AL", "BA", "CE", "MA", "PB", "PE", "PI", "RN", "SE");
    private static final Set<String> NORTE = Set.of("AC", "AP", "AM", "PA", "RO", "RR", "TO");

    public BigDecimal calculate(String state, BigDecimal totalWeightG, Integer totalVolumeMl) {
        BigDecimal weightFromG = (totalWeightG != null) ? totalWeightG : BigDecimal.ZERO;
        BigDecimal weightFromMl = (totalVolumeMl != null) ? new BigDecimal(totalVolumeMl) : BigDecimal.ZERO;
        BigDecimal totalWeight = weightFromG.add(weightFromMl);
        BigDecimal regionRate = getRegionRate(state);

        BigDecimal weightRate;
        if (totalWeight.compareTo(new BigDecimal("1000")) <= 0) {
            weightRate = new BigDecimal("5.00");
        } else if (totalWeight.compareTo(new BigDecimal("3000")) <= 0) {
            weightRate = new BigDecimal("12.00");
        } else if (totalWeight.compareTo(new BigDecimal("5000")) <= 0) {
            weightRate = new BigDecimal("20.00");
        } else {
            weightRate = new BigDecimal("30.00");
        }

        return regionRate.add(weightRate);
    }

    private BigDecimal getRegionRate(String state) {
        if (state == null) return new BigDecimal("20.00");

        String uf = state.trim().toUpperCase();

        if (SUDESTE.contains(uf)) {
            return new BigDecimal("10.00");
        } else if (SUL.contains(uf)) {
            return new BigDecimal("15.00");
        } else if (CENTRO_OESTE.contains(uf)) {
            return new BigDecimal("20.00");
        } else if (NORDESTE.contains(uf)) {
            return new BigDecimal("25.00");
        } else if (NORTE.contains(uf)) {
            return new BigDecimal("30.00");
        }

        return new BigDecimal("20.00");
    }

    public BigDecimal calculate(String state, BigDecimal totalWeightG) {
        return calculate(state, totalWeightG, 0);
    }
}