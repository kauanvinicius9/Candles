package com.reviva.candleshop.service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class MercadoPagoWebhookValidator {
    @Value("${mercadopago.webhook-secret}")
    private String secret;

    public boolean validate( String xSignature, String xRequestId, String dataId) {
        if ( xSignature == null || xRequestId == null || dataId == null) {
            return false;
        }

        String[] parts = xSignature.split(",");
        String ts = null;
        String hash = null;

        for(String part : parts){
            String[] keyValue = part.split("=");
            if(keyValue.length != 2){
                continue;
            }

            if(keyValue[0].trim().equals("ts")){
                ts = keyValue[1];
            }

            if(keyValue[0].trim().equals("v1")){
                hash = keyValue[1];
            }
        }

        if(ts == null || hash == null){
            return false;
        }

        String manifest = "id:" + dataId + ";request-id:" + xRequestId + ";ts:" + ts + ";";

        try {

            Mac mac = Mac.getInstance("HmacSHA256");
            SecretKeySpec key = new SecretKeySpec(secret.getBytes(),"HmacSHA256");
            mac.init(key);
            byte[] result = mac.doFinal(manifest.getBytes());
            String generated = bytesToHex(result);

            return generated.equals(hash);

        } catch(Exception e){
            return false;
        }
    }

    private String bytesToHex(byte[] bytes){
        StringBuilder hex = new StringBuilder();

        for(byte b : bytes){
            hex.append(
                String.format("%02x", b)
            );
        }

        return hex.toString();
    }
}