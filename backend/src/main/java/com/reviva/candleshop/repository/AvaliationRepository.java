package com.reviva.candleshop.repository;

import com.seusite.model.Avaliacao;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AvaliationRepository extends JpaRepository<Avaliation, Long> {
    List<Avaliation> findByProdutoIdAndStatusOrderByCreationDataDesc(Long productId, Avaliation.StatusAvaliation status);
}