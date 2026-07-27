package com.revivas.candleshop.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "avaliacoes")
public class Avaliation {

    @Is
    @Generatedvalue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Seu nome é obrigatório")
    @Size(max = 100)
    private String nameClient;

    @NotNull(message = "Sua nota em estrelas é obrigatória")
    @Min(1) @Max(5)
    private Integer stars;

    @NotBlank(message = "Seu comentário é obrigatório")
    @Size(max = 1000)
    @Column(length = 1000)
    private String feedback;

    @Notnull
    private Long productId;

    @Emunerated(EnumType.STRING)
    private StatusAvaliation status = StatusAvaliation.PENDENTE;
    private LocalDateTime creationDate = LocalDateTime.now();

    public enum StatusAvaliation {
        PENDETE, APROVADO, REJEITADO
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNameClient() { return nameClient; }
    public void setNameClient(String nameClient) { this.nameClient = nameClient; }

    public Integer getStars() { return stars; }
    public void setStars(Integer stars) { this.stars = stars; }

    public String getFeedback() { return feedback; }
    public void setFeedback(String feedback) { this.feedback = feedback; }

    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }

    public StatusAvaliation getStatus() { return status; }
    public void setStatus(StatusAvaliation status) { this.status = status; }

    public LocalDateTime getCreationDate() { return creationDate; }
    public void setCreationDate(LocalDateTime creationDate) { this.creationDate = creationDate; }

}