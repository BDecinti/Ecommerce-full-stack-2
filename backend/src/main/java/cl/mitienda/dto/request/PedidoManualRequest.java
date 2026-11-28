package cl.mitienda.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import java.util.List;

public record PedidoManualRequest(
    @NotEmpty @Size(max = 100) List<@Valid ItemRequest> items,
    @NotNull @Valid EntregaRequest entrega,
    @NotBlank @Email String usuario,
    @NotBlank @Pattern(regexp = "efectivo|debito|transferencia|tarjeta demo")
        String metodoPago) {}
