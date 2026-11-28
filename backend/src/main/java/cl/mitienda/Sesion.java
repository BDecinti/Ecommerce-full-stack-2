package cl.mitienda;

import jakarta.persistence.*;
import java.time.Instant;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "sesiones")
@Getter
@Setter
public class Sesion {
  @Id private String id;

  @ManyToOne(fetch = FetchType.EAGER)
  @JoinColumn(name = "usuario_id")
  private Usuario usuario;

  private String tokenHash;
  private Instant expiraEn;
  private boolean revocada;
  @Version private long version;
}
