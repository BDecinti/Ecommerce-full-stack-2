package cl.mitienda.repository;

import cl.mitienda.model.Categoria;
import java.util.*;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoriaRepository extends JpaRepository<Categoria, Long> {
  List<Categoria> findAllByOrderByIdAsc();

  boolean existsByPadreId(Long id);
}
