package cl.mitienda.controller;

import cl.mitienda.dto.request.CompraRequest;
import cl.mitienda.dto.request.EstadoRequest;
import cl.mitienda.dto.request.PedidoManualRequest;
import cl.mitienda.dto.response.PedidoView;
import cl.mitienda.service.PedidosService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@Tag(name = "2. Catálogo y gestión")
public class PedidoController {
  private final PedidosService pedidos;

  public PedidoController(PedidosService p) {
    pedidos = p;
  }

  @GetMapping("/pedidos")
  @SecurityRequirement(name = "bearerAuth")
  @Operation(summary = "Listar pedidos; clientes reciben solo sus compras")
  public List<PedidoView> pedidos(Authentication a) {
    return pedidos.listar((Long) a.getPrincipal(), cliente(a));
  }

  @GetMapping("/pedidos/{id}")
  @SecurityRequirement(name = "bearerAuth")
  @Operation(summary = "Consultar un pedido propio o gestionar como personal")
  public PedidoView pedido(@PathVariable Long id, Authentication a) {
    return pedidos.obtener(id, (Long) a.getPrincipal(), cliente(a));
  }

  @PostMapping("/pedidos")
  @ResponseStatus(HttpStatus.CREATED)
  @SecurityRequirement(name = "bearerAuth")
  @Operation(summary = "Comprar con precios del servidor, stock bloqueado e idempotencia")
  public PedidoView comprar(
      Authentication a,
      @RequestHeader("Idempotency-Key") String key,
      @Valid @RequestBody CompraRequest d) {
    return pedidos.comprar((Long) a.getPrincipal(), key, d);
  }

  @PostMapping("/admin/pedidos")
  @ResponseStatus(HttpStatus.CREATED)
  @PreAuthorize("hasRole('ADMIN')")
  @SecurityRequirement(name = "bearerAuth")
  @Operation(summary = "Registrar una venta manual a un cliente registrado · administrador")
  public PedidoView manual(
      @RequestHeader("Idempotency-Key") String key, @Valid @RequestBody PedidoManualRequest d) {
    return pedidos.manual(key, d);
  }

  @PatchMapping("/pedidos/{id}/estado")
  @PreAuthorize("hasAnyRole('ADMIN','VENDEDOR')")
  @SecurityRequirement(name = "bearerAuth")
  @Operation(summary = "Cambiar estado; una cancelación repone stock una sola vez")
  public PedidoView estado(@PathVariable Long id, @Valid @RequestBody EstadoRequest d) {
    return pedidos.cambiarEstado(id, d.estado());
  }

  @DeleteMapping("/pedidos/{id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  @PreAuthorize("hasRole('ADMIN')")
  @SecurityRequirement(name = "bearerAuth")
  @Operation(summary = "Eliminar un pedido cancelado · administrador")
  public void eliminarPedido(@PathVariable Long id) {
    pedidos.eliminar(id);
  }

  private boolean cliente(Authentication a) {
    return a.getAuthorities().stream()
        .noneMatch(
            x -> x.getAuthority().equals("ROLE_ADMIN") || x.getAuthority().equals("ROLE_VENDEDOR"));
  }
}
