package cl.mitienda;

import jakarta.persistence.*;
import java.math.BigDecimal;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "productos")
@Getter
@Setter
public class Producto {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private String codigo;
  private String nombre;
  private String marca = "";
  private String descripcion = "";
  private String imagen = "img/placeholder.svg";

  @Column(precision = 14, scale = 0)
  private BigDecimal precio;

  private int stock;
  private int stockCritico;
  private Long categoriaId;
  private boolean destacado;
  private boolean activo = true;
  @Version private long version;
}
