package com.reviva.candleshop.config;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Refill;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;

import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.beans.factory.annotation.Value;

import java.io.IOException;
import java.time.Duration;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class BotBlockConfig extends OncePerRequestFilter {
    private static final List<String> BLOCKED_USER_AGENTS = List.of(
        "GPTBot", "ChatGPT-User", "CCBot", "ClaudeBot", "Anthropic",
        "Google-Extended", "Bytespider", "Diffbot", "FacebookBot",
        "PetalBot", "Scrapy", "python-requests", "curl",  "Wget", "postman"
    );

    @Value("${api.security.secret-key}")
    private String apiSecretKey;
    private final Map<String, Bucket> buckets = new ConcurrentHashMap<>();

    private Bucket createNewBucket() {
        Bandwidth limit = Bandwidth.classic(30, Refill.greedy(30, Duration.ofMinutes(1)));
        return Bucket.builder().addLimit(limit).build();
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
        throws ServletException, IOException {
            String userAgent = request.getHeader("User-Agent");
            String appSecret = request.getHeader("X-Internal-Secret");
            String clientIp = getClientIp(request);
            
            // Excessão de webhooks
            if (isAllowedBypass(request, userAgent)) {
                filterChain.doFilter(request, response);
                return;
            }

            // Bloqueio de user-agent suspeito
            if (userAgent == null || userAgent.isBlank() || isKnownBot(userAgent)) {
                response.setStatus(HttpStatus.FORBIDDEN.value());
                response.getWriter().write("Acesso negado. Dispositivo ou agente não autorizado");
                return;
            }

            // Validação de chave interna
            if (appSecret == null || !appSecret.equals(apiSecretKey)) {
                blockRequest(response, HttpStatus.UNAUTHORIZED, "Acesso negado");
                return;
            }

            // Rate limiting
            Bucket bucket = buckets.computeIfAbsent(clientIp, k -> createNewBucket());
            if (!bucket.tryConsume(1)) {
                blockRequest(response, HttpStatus.TOO_MANY_REQUESTS, "Muitas requisições. Tente novamente em 1 minuto");
                return;
            }

            filterChain.doFilter(request, response);
        }

        private boolean isAllowedBypass(HttpServletRequest request, String userAgent) {
            String uri = request.getRequestURI();

            if (uri.contains("/mercadopago/webhook") || uri.contains("/webhook")) {
                return true;
            }

            if (userAgent != null) {
                String lowerUA = userAgent.toLowerCase();
                return lowerUA.contains("uptimerobot") || lowerUA.contains("pingdom");
            }

            return false;
        }

        private boolean isKnownBot(String userAgent) {
            String lowerUA = userAgent.toLowerCase();
            return BLOCKED_USER_AGENTS.stream().anyMatch(bot -> userAgent.toLowerCase().contains(bot.toLowerCase()));
        }
        
        private void blockRequest(HttpServletResponse response, HttpStatus status, String message) throws IOException {
            response.setStatus(status.value());
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            response.getWriter().write("{\"error\": \"" + message + "\"}");
        }

        private String getClientIp(HttpServletRequest request) {
            String xfHeader = request.getHeader("X-Forwarded-For");
            if (xfHeader == null || xfHeader.isEmpty()) {
                return request.getRemoteAddr();
            }

            return xfHeader.split(",")[0].trim();
        }
}