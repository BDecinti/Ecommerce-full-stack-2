package cl.mitienda.dto.request;

import jakarta.validation.constraints.*;

public record RegistroRequest(
    @NotBlank @Size(max = 80) String nombre,
    @NotBlank @Email @Size(max = 150) String email,
    @NotBlank @Size(min = 8, max = 128) String password) {}
