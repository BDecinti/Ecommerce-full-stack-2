package cl.mitienda.controller;

import cl.mitienda.dto.request.CategoriaRequest;
import cl.mitienda.dto.response.CategoriaView;
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
@RequestMapping("/api/categorias")
@Tag(name = "2. Catálogo y gestión")
public class CategoriaController {
  private final CatalogoService catalogo;

  public CategoriaController(CatalogoService c) {
    catalogo = c;
  }

  @GetMapping
  @Operation(summary = "Listar categorías y subcategorías")
  public List<CategoriaView> categorias() {
    return catalogo.categorias();
  }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  @PreAuthorize("hasRole('ADMIN')")
  @SecurityRequirement(name = "bearerAuth")
  @Operation(summary = "Crear una categoría · administrador")
  public CategoriaView crearCategoria(@Valid @RequestBody CategoriaRequest d) {
    return catalogo.guardarCategoria(null, d);
  }

  @PutMapping("/{id}")
  @PreAuthorize("hasRole('ADMIN')")
  @SecurityRequirement(name = "bearerAuth")
  @Operation(summary = "Editar una categoría · administrador")
  public CategoriaView editarCategoria(
      @PathVariable Long id, @Valid @RequestBody CategoriaRequest d) {
    return catalogo.guardarCategoria(id, d);
  }

  @DeleteMapping("/{id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  @PreAuthorize("hasRole('ADMIN')")
  @SecurityRequirement(name = "bearerAuth")
  @Operation(summary = "Eliminar una categoría sin dependencias · administrador")
  public void eliminarCategoria(@PathVariable Long id) {
    catalogo.eliminarCategoria(id);
  }
}
