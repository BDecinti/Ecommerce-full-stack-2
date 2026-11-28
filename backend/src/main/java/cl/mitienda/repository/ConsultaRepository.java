package cl.mitienda.repository;

import cl.mitienda.model.Consulta;
import java.util.*;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ConsultaRepository extends JpaRepository<Consulta, Long> {
  List<Consulta> findAllByOrderByIdDesc();
}
