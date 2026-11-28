package cl.mitienda.controller;

import cl.mitienda.dto.request.ProductoRequest;
import cl.mitienda.dto.response.ProductoView;
import cl.mitienda.service.CatalogoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/productos")
@Tag(name = "2. Catálogo y gestión")
public class ProductoController {
  private final CatalogoService catalogo;

  public ProductoController(CatalogoService c) {
    catalogo = c;
  }

  @GetMapping
  @Operation(summary = "Listar el catálogo público")
  public List<ProductoView> productos() {
    return catalogo.productos();
  }

  @GetMapping("/{id}")
  @Operation(summary = "Consultar un producto")
  public ProductoView producto(@PathVariable Long id) {
    return catalogo.producto(id);
  }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  @PreAuthorize("hasAnyRole('ADMIN','VENDEDOR')")
  @SecurityRequirement(name = "bearerAuth")
  @Operation(summary = "Crear un producto · administrador o vendedor")
  public ProductoView crearProducto(@Valid @RequestBody ProductoRequest d) {
    return catalogo.guardar(null, d);
  }

  @PutMapping("/{id}")
  @PreAuthorize("hasAnyRole('ADMIN','VENDEDOR')")
  @SecurityRequirement(name = "bearerAuth")
  @Operation(summary = "Actualizar un producto · administrador o vendedor")
  public ProductoView editarProducto(@PathVariable Long id, @Valid @RequestBody ProductoRequest d) {
    return catalogo.guardar(id, d);
  }

  @DeleteMapping("/{id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  @PreAuthorize("hasRole('ADMIN')")
  @SecurityRequirement(name = "bearerAuth")
  @Operation(summary = "Retirar un producto · administrador")
  public void eliminarProducto(@PathVariable Long id) {
    catalogo.eliminarProducto(id);
  }
}
