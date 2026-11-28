package cl.mitienda.repository;

import cl.mitienda.model.Usuario;
import java.util.*;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
  Optional<Usuario> findByEmailIgnoreCase(String email);

  List<Usuario> findByActivoTrueOrderByIdAsc();

  long countByRolAndActivoTrue(String rol);
}
