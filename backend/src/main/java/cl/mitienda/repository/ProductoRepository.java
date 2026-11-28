package cl.mitienda.repository;

import cl.mitienda.model.Producto;
import jakarta.persistence.LockModeType;
import java.util.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ProductoRepository extends JpaRepository<Producto, Long> {
  List<Producto> findByActivoTrueOrderByIdAsc();

  boolean existsByCategoriaIdAndActivoTrue(Long id);

  boolean existsByCodigoIgnoreCaseAndIdNot(String codigo, Long id);

  @Lock(LockModeType.PESSIMISTIC_WRITE)
  @Query("select p from Producto p where p.id=:id")
  Optional<Producto> bloquear(@Param("id") Long id);
}
