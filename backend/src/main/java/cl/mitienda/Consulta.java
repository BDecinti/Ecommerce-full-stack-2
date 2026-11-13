package cl.mitienda;

import jakarta.persistence.*;
import java.time.Instant;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "consultas")
@Getter
@Setter
public class Consulta {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private String nombre;
  private String email;
  private String asunto;
  private String comentario;
  private Instant fecha = Instant.now();
}
