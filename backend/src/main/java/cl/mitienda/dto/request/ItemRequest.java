package cl.mitienda.dto.request;

import jakarta.validation.constraints.*;

public record ItemRequest(@NotNull @Positive Long id, @Min(1) @Max(1000) int cantidad) {}
