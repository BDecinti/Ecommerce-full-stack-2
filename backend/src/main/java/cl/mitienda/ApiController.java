package cl.mitienda;

import static cl.mitienda.ApiDtos.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.*;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@Tag(name = "2. Catálogo y gestión")
public class ApiController {
  private final CatalogoService catalogo;
  private final UsuariosService usuarios;
  private final PedidosService pedidos;
  private final ConsultaRepository consultas;

  public ApiController(
      CatalogoService c, UsuariosService u, PedidosService p, ConsultaRepository q) {
    catalogo = c;
    usuarios = u;
    pedidos = p;
    consultas = q;
  }

  @GetMapping("/health")
  @Operation(summary = "Comprobar disponibilidad de la API")
  public Map<String, String> health() {
    return Map.of("status", "UP", "application", "MiTienda API");
  }

  @GetMapping("/productos")
  @Operation(summary = "Listar el catálogo público")
  public List<ProductoView> productos() {
    return catalogo.productos();
  }

  @GetMapping("/productos/{id}")
  @Operation(summary = "Consultar un producto")
  public ProductoView producto(@PathVariable Long id) {
    return catalogo.producto(id);
  }

  @PostMapping("/productos")
  @ResponseStatus(HttpStatus.CREATED)
  @PreAuthorize("hasAnyRole('ADMIN','VENDEDOR')")
  @SecurityRequirement(name = "bearerAuth")
  @Operation(summary = "Crear un producto · administrador o vendedor")
  public ProductoView crearProducto(@Valid @RequestBody ProductoRequest d) {
    return catalogo.guardar(null, d);
  }

  @PutMapping("/productos/{id}")
  @PreAuthorize("hasAnyRole('ADMIN','VENDEDOR')")
  @SecurityRequirement(name = "bearerAuth")
  @Operation(summary = "Actualizar un producto · administrador o vendedor")
  public ProductoView editarProducto(@PathVariable Long id, @Valid @RequestBody ProductoRequest d) {
    return catalogo.guardar(id, d);
  }

  @DeleteMapping("/productos/{id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  @PreAuthorize("hasRole('ADMIN')")
  @SecurityRequirement(name = "bearerAuth")
  @Operation(summary = "Retirar un producto · administrador")
  public void eliminarProducto(@PathVariable Long id) {
    catalogo.eliminarProducto(id);
  }

  @GetMapping("/categorias")
  @Operation(summary = "Listar categorías y subcategorías")
  public List<CategoriaView> categorias() {
    return catalogo.categorias();
  }

  @PostMapping("/categorias")
  @ResponseStatus(HttpStatus.CREATED)
  @PreAuthorize("hasRole('ADMIN')")
  @SecurityRequirement(name = "bearerAuth")
  @Operation(summary = "Crear una categoría · administrador")
  public CategoriaView crearCategoria(@Valid @RequestBody CategoriaRequest d) {
    return catalogo.guardarCategoria(null, d);
  }

  @PutMapping("/categorias/{id}")
  @PreAuthorize("hasRole('ADMIN')")
  @SecurityRequirement(name = "bearerAuth")
  @Operation(summary = "Editar una categoría · administrador")
  public CategoriaView editarCategoria(
      @PathVariable Long id, @Valid @RequestBody CategoriaRequest d) {
    return catalogo.guardarCategoria(id, d);
  }

  @DeleteMapping("/categorias/{id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  @PreAuthorize("hasRole('ADMIN')")
  @SecurityRequirement(name = "bearerAuth")
  @Operation(summary = "Eliminar una categoría sin dependencias · administrador")
  public void eliminarCategoria(@PathVariable Long id) {
    catalogo.eliminarCategoria(id);
  }

  @GetMapping("/usuarios")
  @PreAuthorize("hasRole('ADMIN')")
  @SecurityRequirement(name = "bearerAuth")
  @Operation(summary = "Listar usuarios sin contraseñas · administrador")
  public List<UsuarioView> usuarios() {
    return usuarios.listar();
  }

  @GetMapping("/usuarios/{id}")
  @PreAuthorize("hasRole('ADMIN')")
  @SecurityRequirement(name = "bearerAuth")
  @Operation(summary = "Consultar un usuario · administrador")
  public UsuarioView usuario(@PathVariable Long id) {
    return usuarios.obtener(id);
  }

  @PostMapping("/usuarios")
  @ResponseStatus(HttpStatus.CREATED)
  @PreAuthorize("hasRole('ADMIN')")
  @SecurityRequirement(name = "bearerAuth")
  @Operation(summary = "Crear un usuario y asignar rol · administrador")
  public UsuarioView crearUsuario(@Valid @RequestBody UsuarioRequest d) {
    return usuarios.guardar(null, d);
  }

  @PutMapping("/usuarios/{id}")
  @PreAuthorize("hasRole('ADMIN')")
  @SecurityRequirement(name = "bearerAuth")
  @Operation(summary = "Editar datos y rol; revoca sesiones al cambiar seguridad · administrador")
  public UsuarioView editarUsuario(@PathVariable Long id, @Valid @RequestBody UsuarioRequest d) {
    return usuarios.guardar(id, d);
  }

  @DeleteMapping("/usuarios/{id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  @PreAuthorize("hasRole('ADMIN')")
  @SecurityRequirement(name = "bearerAuth")
  @Operation(summary = "Desactivar un usuario y revocar sesiones · administrador")
  public void eliminarUsuario(@PathVariable Long id) {
    usuarios.eliminar(id);
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

  @PostMapping("/consultas")
  @ResponseStatus(HttpStatus.CREATED)
  @Operation(summary = "Guardar una consulta de contacto en la base de datos")
  public ConsultaView consulta(@Valid @RequestBody ConsultaRequest d) {
    Consulta c = new Consulta();
    c.setNombre(d.nombre().trim());
    c.setEmail(d.email().trim().toLowerCase(Locale.ROOT));
    c.setAsunto(Vistas.limpio(d.asunto()));
    c.setComentario(d.comentario().trim());
    consultas.save(c);
    return consultaView(c);
  }

  @GetMapping("/consultas")
  @PreAuthorize("hasRole('ADMIN')")
  @SecurityRequirement(name = "bearerAuth")
  @Operation(summary = "Listar consultas recibidas · administrador")
  public List<ConsultaView> consultas() {
    return consultas.findAllByOrderByIdDesc().stream().map(this::consultaView).toList();
  }

  private ConsultaView consultaView(Consulta c) {
    return new ConsultaView(
        c.getId(), c.getNombre(), c.getEmail(), c.getAsunto(), c.getComentario(), c.getFecha());
  }

  private boolean cliente(Authentication a) {
    return a.getAuthorities().stream()
        .noneMatch(
            x -> x.getAuthority().equals("ROLE_ADMIN") || x.getAuthority().equals("ROLE_VENDEDOR"));
  }
}
