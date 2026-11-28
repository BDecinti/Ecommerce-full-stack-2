package cl.mitienda.dto.request;

import jakarta.validation.constraints.*;

public record ConsultaRequest(
    @NotBlank @Size(max = 100) String nombre,
    @NotBlank @Email @Size(max = 150) String email,
    @Size(max = 150) String asunto,
    @NotBlank @Size(max = 3000) String comentario) {}
