package com.reviva.candleshop.repository;

import com.reviva.candleshop.model.Avaliation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AvaliationRepository extends JpaRepository<Avaliation, Long> {
    List<Avaliation> findByStatusOrderByCreationDateDesc(Avaliation.StatusAvaliation status);
}