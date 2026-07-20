package com.reviva.candleshop.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.reviva.candleshop.dto.CardPaymentRequestDto;
import com.reviva.candleshop.service.CardPaymentService;

@RestController
@RequestMapping("/api/pagamentos")
public class PaymentController {
    private final CardPaymentService cardPaymentService;

    public PaymentController(CardPaymentService cardPaymentService){
        this.cardPaymentService = cardPaymentService;
    }

    @PostMapping("/cartao")
    public ResponseEntity<?> payCard(@RequestBody CardPaymentRequestDto request){
        return ResponseEntity.ok(
                cardPaymentService.createPayment(request)
        );
    }
}