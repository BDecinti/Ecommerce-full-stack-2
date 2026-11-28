package cl.mitienda.dto.request;

import jakarta.validation.constraints.*;

public record TarjetaRequest(
    @NotBlank @Size(max = 30) String numero,
    @NotBlank @Size(max = 100) String titular,
    @NotBlank @Pattern(regexp = "(0[1-9]|1[0-2])/\\d{2}") String vencimiento,
    @NotBlank @Pattern(regexp = "\\d{3}") String cvv) {}
