package cl.mitienda.dto.response;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public record PedidoView(
    Long id,
    String usuario,
    Instant fecha,
    String estado,
    String nombre,
    String email,
    String telefono,
    String tipoEntrega,
    String direccion,
    String comuna,
    String region,
    String metodoPago,
    BigDecimal subtotal,
    BigDecimal costoEnvio,
    BigDecimal total,
    boolean pagoSimulado,
    List<ItemView> items) {}
