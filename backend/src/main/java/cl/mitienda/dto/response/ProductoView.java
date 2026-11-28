package cl.mitienda.dto.response;

import java.math.BigDecimal;

public record ProductoView(
    Long id,
    String codigo,
    String nombre,
    String marca,
    String descripcion,
    String imagen,
    BigDecimal precio,
    int stock,
    int stockCritico,
    Long categoriaId,
    boolean destacado) {}
