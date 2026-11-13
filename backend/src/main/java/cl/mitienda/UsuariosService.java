package cl.mitienda;

import static cl.mitienda.ApiDtos.*;

import java.util.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class UsuariosService {
  private final UsuarioRepository usuarios;
  private final SesionRepository sesiones;
  private final PasswordEncoder passwords;

  public UsuariosService(UsuarioRepository u, SesionRepository s, PasswordEncoder p) {
    usuarios = u;
    sesiones = s;
    passwords = p;
  }

  @Transactional(readOnly = true)
  public List<UsuarioView> listar() {
    return usuarios.findByActivoTrueOrderByIdAsc().stream().map(Vistas::usuario).toList();
  }

  @Transactional(readOnly = true)
  public UsuarioView obtener(Long id) {
    return Vistas.usuario(buscar(id));
  }

  Usuario buscar(Long id) {
    return usuarios
        .findById(id)
        .filter(Usuario::isActivo)
        .orElseThrow(() -> ApiException.noExiste("Usuario"));
  }

  public UsuarioView guardar(Long id, UsuarioRequest d) {
    Usuario u = id == null ? new Usuario() : buscar(id);
    String email = d.email().trim().toLowerCase(Locale.ROOT);
    usuarios
        .findByEmailIgnoreCase(email)
        .filter(x -> !Objects.equals(x.getId(), id))
        .ifPresent(x -> {
          throw ApiException.conflicto("Ya existe un usuario con ese correo.");
        });
    if (id != null
        && u.getRol().equals("admin")
        && !d.rol().equals("admin")
        && usuarios.countByRolAndActivoTrue("admin") <= 1)
      throw ApiException.conflicto("Debe existir al menos un administrador activo.");
    boolean cambioSeguridad = !u.getRol().equals(d.rol()) || !Objects.equals(u.getEmail(), email);
    if (id == null || (d.password() != null && !d.password().isBlank())) {
      if (d.password() == null || d.password().length() < 8)
        throw ApiException.invalido("La contraseña debe tener al menos 8 caracteres.");
      u.setPasswordHash(passwords.encode(d.password()));
      cambioSeguridad = true;
    }
    u.setNombre(d.nombre().trim());
    u.setApellidos(Vistas.limpio(d.apellidos()));
    u.setEmail(email);
    u.setRol(d.rol());
    u.setRun(Vistas.limpio(d.run()));
    u.setFechaNacimiento(Vistas.limpio(d.fechaNacimiento()));
    u.setRegion(Vistas.limpio(d.region()));
    u.setComuna(Vistas.limpio(d.comuna()));
    u.setDireccion(Vistas.limpio(d.direccion()));
    usuarios.saveAndFlush(u);
    if (id != null && cambioSeguridad) revocar(id);
    return Vistas.usuario(u);
  }

  public void eliminar(Long id) {
    Usuario u = buscar(id);
    if (u.getRol().equals("admin") && usuarios.countByRolAndActivoTrue("admin") <= 1)
      throw ApiException.conflicto("No se puede retirar el último administrador.");
    u.setActivo(false);
    revocar(id);
  }

  private void revocar(Long id) {
    sesiones
        .findByUsuarioId(id)
        .forEach(s -> {
          s.setRevocada(true);
          sesiones.save(s);
        });
  }
}
