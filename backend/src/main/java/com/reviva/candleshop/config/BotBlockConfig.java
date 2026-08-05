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
        "PetalBot", "Scrapy", "python-requests", "curl",  "Wget"
    );

    private final Map<String, Bucket> buckets = new ConcurrentHashMap<>();
    private Bucket createNewBucket() {
        BandWith limit = Bandwith.classic(30, Refill.greedy(30, Duration.ofMinutes(1)));
        return Bucket.builder().addLimit(limit).build();
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
        throws ServletException, IOException {
            String userAgent = request.getHeader("User-Agent");
            String clientIp = getClientIp(request);

            if (userAgent == null || userAgent.isBlank() || isKnownBot(userAgent)) {
                response.setStatus(HttpStatus.FORBIDDEN.value());
                response.getWriter().write("Acesso negado. Dispositivo ou agente não autorizado");
                return;
            }

            if (!request.getRequestURI().contains("/webhook")) {
                Bucket bucket = buckets.computeIfAbsent(clientIp, k -> createNewBucket());
                if (!bucket.tryConsume(1)) {
                    response.setStatus(429);
                    response.getWriter().write("Muitas requisições");
                    return;
                }
            }

            filterChain.doFilter(request, response);
        }

        private boolean isKnownBot(String userAgent) {
            String lowerUA = userAgent.toLowerCase();

            // Não bloqueia o bot de monitoramento da API
            if (lowerUA.contains("uptimerobot") || lowerUA.contains("pingdom")) {
                return false;
            }

            return BLOCKED_USER_AGENTS.stream().anyMatch(bot -> userAgent.toLowerCase().contains(bot.toLowerCase()));
        }

        private String getClientIp(HttpServletRequest request) {
            String xfHeader = request.getHeader("X-Forwarded-For");
            if (xfHeader == null || xfHeader.isEmpty()) {
                return request.getRemoteAddr();
            }

            return xfHeader.split(",")[0];
        }
}
