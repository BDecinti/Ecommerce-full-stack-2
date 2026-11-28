package cl.mitienda.dto.request;

import jakarta.validation.constraints.*;

public record EntregaRequest(
    @NotBlank @Size(max = 100) String nombre,
    @NotBlank @Email @Size(max = 150) String email,
    @NotBlank @Size(max = 30) String telefono,
    @NotBlank @Pattern(regexp = "envio|presencial") String tipoEntrega,
    @Size(max = 300) String direccion,
    @Size(max = 100) String comuna,
    @Size(max = 100) String region) {}
