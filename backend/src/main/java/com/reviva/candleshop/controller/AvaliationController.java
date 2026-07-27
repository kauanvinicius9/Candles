package com.reviva.candleshop.controller;

import com.reviva.candleshop.dto.AvaliationDTO;
import com.reviva.candleshop.model.Avaliation;
import com.reviva.candleshop.repository.AvaliationRepository;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/avaliacoes")
@CrossOrigin(origins = "http://localhost:4200")
public class AvaliationController {
    
    private final AvaliationRepository repository;
    public AvaliationController(AvaliationRepository repository) {
        this.repository = repository;
    }

    // Listagem de avaliações aprovadas
    @GetMapping("/produto/{produtoId}")
    public ResponseEntity<List<Avaliation>> listByProduct(@PathVariable Long productId) {
        List<Avaliation> aprovadas = repository.findByProductIdAndStatusOrderByCreationDataDesc(
            productId, Avaliation.StatusAvaliation.APROVADO
        );
        return ResponseEntity.ok(aprovadas);
    }

    // Endpoint pública
    @PostMapping
    public ResponseEntity<String> create(@Valid @RequestBody AvaliationDTO dto) {
        Avaliation avaliation = new Avaliation();
        avaliation.setNameClient(dto.nameClient());
        avaliation.setStars(dto.stars());
        avaliation.setFeedback(dto.feedback());
        avaliation.setProductId(dto.productId());
        // Status já pendente

        repository.save(avaliation);
        return ResponseEntity.status(HttpStatus.CREATED).body("Avaliação enviada. Ela ficará visível assim que for aprovada")
    }

    // Endpoint adm
    @PatchMapping("/{id}/aprovar")
    public ResponseEntity<Void> approve(@PathVariable Long id) {
        return repository.findById(id).map(avali -> {
            avali.setStatus(Avaliation.StatusAvaliation.APROVADO);
            repository.save(avali);
            return ResponseEntity.ok().<Void>build();
        }).orElse(ResponseEntity.notFound().build());
    }
}