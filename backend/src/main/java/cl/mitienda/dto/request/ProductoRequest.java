package cl.mitienda.dto.request;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;

public record ProductoRequest(
    @NotBlank @Size(max = 60) String codigo,
    @NotBlank @Size(max = 150) String nombre,
    @Size(max = 100) String marca,
    @Size(max = 2000) String descripcion,
    @Size(max = 2000) String imagen,
    @NotNull @DecimalMin("1") @DecimalMax("100000000") @Digits(integer = 9, fraction = 0)
        BigDecimal precio,
    @Min(0) @Max(100000) int stock,
    @Min(0) @Max(100000) int stockCritico,
    @NotNull @Positive Long categoriaId,
    boolean destacado) {}
