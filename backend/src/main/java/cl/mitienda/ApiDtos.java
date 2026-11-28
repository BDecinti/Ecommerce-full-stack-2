package cl.mitienda;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public final class ApiDtos {
  private ApiDtos() {}

  public record LoginRequest(
      @NotBlank @Email @Size(max = 150) String email, @NotBlank @Size(max = 128) String password) {}

  public record RegistroRequest(
      @NotBlank @Size(max = 80) String nombre,
      @NotBlank @Email @Size(max = 150) String email,
      @NotBlank @Size(min = 8, max = 128) String password) {}

  public record UsuarioRequest(
      @NotBlank @Size(max = 80) String nombre,
      @Size(max = 100) String apellidos,
      @NotBlank @Email @Size(max = 150) String email,
      @Size(max = 128) String password,
      @NotBlank @Pattern(regexp = "admin|vendedor|cliente") String rol,
      @Size(max = 15) String run,
      @Size(max = 10) String fechaNacimiento,
      @Size(max = 100) String region,
      @Size(max = 100) String comuna,
      @Size(max = 300) String direccion) {}

  public record UsuarioView(
      Long id,
      String nombre,
      String apellidos,
      String email,
      String rol,
      String run,
      String fechaNacimiento,
      String region,
      String comuna,
      String direccion,
      boolean activo) {}

  public record AuthView(
      String accessToken, String tokenType, long expiresIn, UsuarioView usuario) {}

  public record CategoriaRequest(
      @NotBlank @Size(max = 100) String nombre, @Positive Long padreId) {}

  public record CategoriaView(Long id, String nombre, Long padreId) {}

  public record ProductoRequest(
      @NotBlank @Size(max = 60) String codigo,
      @NotBlank @Size(max = 150) String nombre,
      @Size(max = 100) String marca,
      @Size(max = 2000) String descripcion,
      @Size(max = 2000) String imagen,
      @NotNull @DecimalMin("1") @DecimalMax("100000000") @Digits(integer = 9, fraction = 0)
          BigDecimal precio,
      @Min(0) @Max(100000) int stock,
      @Min(0) @Max(100000) int stockCritico,
      @NotNull @Positive Long categoriaId,
      boolean destacado) {}

  public record ProductoView(
      Long id,
      String codigo,
      String nombre,
      String marca,
      String descripcion,
      String imagen,
      BigDecimal precio,
      int stock,
      int stockCritico,
      Long categoriaId,
      boolean destacado) {}

  public record ItemRequest(@NotNull @Positive Long id, @Min(1) @Max(1000) int cantidad) {}

  public record EntregaRequest(
      @NotBlank @Size(max = 100) String nombre,
      @NotBlank @Email @Size(max = 150) String email,
      @NotBlank @Size(max = 30) String telefono,
      @NotBlank @Pattern(regexp = "envio|presencial") String tipoEntrega,
      @Size(max = 300) String direccion,
      @Size(max = 100) String comuna,
      @Size(max = 100) String region) {}

  public record TarjetaRequest(
      @NotBlank @Size(max = 30) String numero,
      @NotBlank @Size(max = 100) String titular,
      @NotBlank @Pattern(regexp = "(0[1-9]|1[0-2])/\\d{2}") String vencimiento,
      @NotBlank @Pattern(regexp = "\\d{3}") String cvv) {}

  public record CompraRequest(
      @NotEmpty @Size(max = 100) List<@Valid ItemRequest> items,
      @NotNull @Valid EntregaRequest entrega,
      @NotNull @Valid TarjetaRequest tarjeta) {}

  public record PedidoManualRequest(
      @NotEmpty @Size(max = 100) List<@Valid ItemRequest> items,
      @NotNull @Valid EntregaRequest entrega,
      @NotBlank @Email String usuario,
      @NotBlank @Pattern(regexp = "efectivo|debito|transferencia|tarjeta demo")
          String metodoPago) {}

  public record EstadoRequest(
      @NotBlank @Pattern(regexp = "pagado|en preparación|entregado|cancelado") String estado) {}

  public record ItemView(Long id, String nombre, String imagen, BigDecimal precio, int cantidad) {}

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

  public record ConsultaRequest(
      @NotBlank @Size(max = 100) String nombre,
      @NotBlank @Email @Size(max = 150) String email,
      @Size(max = 150) String asunto,
      @NotBlank @Size(max = 3000) String comentario) {}

  public record ConsultaView(
      Long id, String nombre, String email, String asunto, String comentario, Instant fecha) {}
}
