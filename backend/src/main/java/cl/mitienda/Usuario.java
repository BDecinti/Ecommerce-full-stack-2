package cl.mitienda;

import jakarta.persistence.*;
import java.time.Instant;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "usuarios")
@Getter
@Setter
public class Usuario {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private String nombre;
  private String apellidos = "";
  private String email;
  private String passwordHash;
  private String rol = "cliente";
  private String run = "";
  private String fechaNacimiento = "";
  private String region = "";
  private String comuna = "";
  private String direccion = "";
  private boolean activo = true;
  private Instant creadoEn = Instant.now();
}
