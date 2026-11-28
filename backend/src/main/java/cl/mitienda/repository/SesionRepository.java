package cl.mitienda.repository;

import cl.mitienda.model.Sesion;
import jakarta.persistence.LockModeType;
import java.util.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface SesionRepository extends JpaRepository<Sesion, String> {
  @Lock(LockModeType.PESSIMISTIC_WRITE)
  @Query("select s from Sesion s join fetch s.usuario where s.tokenHash=:hash")
  Optional<Sesion> bloquearPorToken(@Param("hash") String hash);

  List<Sesion> findByUsuarioId(Long id);
}
