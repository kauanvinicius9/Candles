package com.reviva.candleshop.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.reviva.candleshop.service.MercadoPagoWebhookService;

@RestController
@RequestMapping("/api/pagamentos")
public class MercadoPagoWebhookController {
    private final MercadoPagoWebhookService webhookService;
    private final MercadoPagoWebhookValidator validator;

    public MercadoPagoWebHookController(
        MercadoPagoWebhookService webhookService,
        MercadoPagoWebhookValidator validator
    ) {
        this.webhookService = webhookService;
        this.validator = validator;
    }

    @PostMapping("/webhook")
    public ResponseEntity<Void> receiveWebhook(
        @RequestBody String payload,

        @RequestHeader(
            value = "x-signature",
            required = false
        )
        String signature,

        @RequestHeader(
            value = "x-request-id",
            required = false
        )
        String requestId,

        @RequestParam(required = false)
        String type,

        @RequestParam(required = false)
        String data_id
    ) {

        boolean valid = validator.validate(signature, requestId, data_id);
        if (!valid) {
            return ResponseEntity .badRequest() .build();
        }
        
        webhookService.processWebHook(
            type,
            data_id
        );

        return ResponseEntity.ok().build();
    }
}