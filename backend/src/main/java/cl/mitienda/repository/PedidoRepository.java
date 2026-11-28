package cl.mitienda.repository;

import cl.mitienda.model.Pedido;
import jakarta.persistence.LockModeType;
import java.util.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface PedidoRepository extends JpaRepository<Pedido, Long> {
  List<Pedido> findAllByOrderByIdDesc();

  List<Pedido> findByUsuarioIdOrderByIdDesc(Long id);

  Optional<Pedido> findByClaveCompra(String clave);

  @Lock(LockModeType.PESSIMISTIC_WRITE)
  @Query("select p from Pedido p where p.id=:id")
  Optional<Pedido> bloquear(@Param("id") Long id);
}
