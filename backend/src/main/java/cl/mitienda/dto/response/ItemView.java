package cl.mitienda.dto.response;

import java.math.BigDecimal;

public record ItemView(Long id, String nombre, String imagen, BigDecimal precio, int cantidad) {}
