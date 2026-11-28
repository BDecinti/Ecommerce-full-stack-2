package cl.mitienda.controller;

import cl.mitienda.dto.request.UsuarioRequest;
import cl.mitienda.dto.response.UsuarioView;
import cl.mitienda.service.UsuariosService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/usuarios")
@Tag(name = "2. Catálogo y gestión")
public class UsuarioController {
  private final UsuariosService usuarios;

  public UsuarioController(UsuariosService u) {
    usuarios = u;
  }

  @GetMapping
  @PreAuthorize("hasRole('ADMIN')")
  @SecurityRequirement(name = "bearerAuth")
  @Operation(summary = "Listar usuarios sin contraseñas · administrador")
  public List<UsuarioView> usuarios() {
    return usuarios.listar();
  }

  @GetMapping("/{id}")
  @PreAuthorize("hasRole('ADMIN')")
  @SecurityRequirement(name = "bearerAuth")
  @Operation(summary = "Consultar un usuario · administrador")
  public UsuarioView usuario(@PathVariable Long id) {
    return usuarios.obtener(id);
  }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  @PreAuthorize("hasRole('ADMIN')")
  @SecurityRequirement(name = "bearerAuth")
  @Operation(summary = "Crear un usuario y asignar rol · administrador")
  public UsuarioView crearUsuario(@Valid @RequestBody UsuarioRequest d) {
    return usuarios.guardar(null, d);
  }

  @PutMapping("/{id}")
  @PreAuthorize("hasRole('ADMIN')")
  @SecurityRequirement(name = "bearerAuth")
  @Operation(summary = "Editar datos y rol; revoca sesiones al cambiar seguridad · administrador")
  public UsuarioView editarUsuario(@PathVariable Long id, @Valid @RequestBody UsuarioRequest d) {
    return usuarios.guardar(id, d);
  }

  @DeleteMapping("/{id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  @PreAuthorize("hasRole('ADMIN')")
  @SecurityRequirement(name = "bearerAuth")
  @Operation(summary = "Desactivar un usuario y revocar sesiones · administrador")
  public void eliminarUsuario(@PathVariable Long id) {
    usuarios.eliminar(id);
  }
}
