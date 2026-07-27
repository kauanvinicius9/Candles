package com.reviva.candleshop.dto;

import jakarta.validation.constraints.*;

public record AvaliacaoDTO(
    @NotBlank(message = "Informe seu nome")
    String nameClient,

    @NotNull(message = "Selecione de 01 a 05 estrelas")
    Integer stars,

    @NotBlank(message = "Escreva um comentário")
    String feedback,

    @NotNull
    Long productId
) {}