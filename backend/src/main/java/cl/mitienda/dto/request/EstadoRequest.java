package cl.mitienda.dto.request;

import jakarta.validation.constraints.*;

public record EstadoRequest(
    @NotBlank @Pattern(regexp = "pagado|en preparación|entregado|cancelado") String estado) {}
