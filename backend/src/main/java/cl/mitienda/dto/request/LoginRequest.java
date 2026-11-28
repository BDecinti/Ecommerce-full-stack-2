package cl.mitienda.dto.request;

import jakarta.validation.constraints.*;

public record LoginRequest(
    @NotBlank @Email @Size(max = 150) String email, @NotBlank @Size(max = 128) String password) {}
