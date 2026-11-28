package cl.mitienda.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import java.util.List;

public record CompraRequest(
    @NotEmpty @Size(max = 100) List<@Valid ItemRequest> items,
    @NotNull @Valid EntregaRequest entrega,
    @NotNull @Valid TarjetaRequest tarjeta) {}
