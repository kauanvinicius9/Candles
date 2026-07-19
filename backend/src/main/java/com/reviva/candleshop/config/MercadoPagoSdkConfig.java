package com.reviva.candleshop.config;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MercadoPagoSdkConfig {

    @Value("${mercadopago.access-token}")
    private String accessToken;

    @PostConstruct
    public void configure() {
        com.mercadopago.MercadoPagoConfig.setAccessToken(accessToken);
    }
}
