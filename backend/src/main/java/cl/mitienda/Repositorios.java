package cl.mitienda;

import jakarta.persistence.LockModeType;
import java.util.*;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

interface UsuarioRepository extends JpaRepository<Usuario, Long> {
  Optional<Usuario> findByEmailIgnoreCase(String email);

  List<Usuario> findByActivoTrueOrderByIdAsc();

  long countByRolAndActivoTrue(String rol);
}

interface CategoriaRepository extends JpaRepository<Categoria, Long> {
  List<Categoria> findAllByOrderByIdAsc();

  boolean existsByPadreId(Long id);
}

interface ProductoRepository extends JpaRepository<Producto, Long> {
  List<Producto> findByActivoTrueOrderByIdAsc();

  boolean existsByCategoriaIdAndActivoTrue(Long id);

  boolean existsByCodigoIgnoreCaseAndIdNot(String codigo, Long id);

  @Lock(LockModeType.PESSIMISTIC_WRITE)
  @Query("select p from Producto p where p.id=:id")
  Optional<Producto> bloquear(@Param("id") Long id);
}

interface SesionRepository extends JpaRepository<Sesion, String> {
  @Lock(LockModeType.PESSIMISTIC_WRITE)
  @Query("select s from Sesion s join fetch s.usuario where s.tokenHash=:hash")
  Optional<Sesion> bloquearPorToken(@Param("hash") String hash);

  List<Sesion> findByUsuarioId(Long id);
}

interface PedidoRepository extends JpaRepository<Pedido, Long> {
  List<Pedido> findAllByOrderByIdDesc();

  List<Pedido> findByUsuarioIdOrderByIdDesc(Long id);

  Optional<Pedido> findByClaveCompra(String clave);

  @Lock(LockModeType.PESSIMISTIC_WRITE)
  @Query("select p from Pedido p where p.id=:id")
  Optional<Pedido> bloquear(@Param("id") Long id);
}

interface ConsultaRepository extends JpaRepository<Consulta, Long> {
  List<Consulta> findAllByOrderByIdDesc();
}
