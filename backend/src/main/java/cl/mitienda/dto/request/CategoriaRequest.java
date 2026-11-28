package cl.mitienda.dto.request;

import jakarta.validation.constraints.*;

public record CategoriaRequest(
    @NotBlank @Size(max = 100) String nombre, @Positive Long padreId) {}
