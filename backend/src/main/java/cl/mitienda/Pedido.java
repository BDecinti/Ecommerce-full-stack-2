package cl.mitienda;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "pedidos")
@Getter
@Setter
public class Pedido {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private Long usuarioId;
  private String usuario;
  private Instant fecha = Instant.now();
  private String estado = "pagado";
  private String nombre;
  private String email;
  private String telefono;
  private String tipoEntrega;
  private String direccion = "";
  private String comuna = "";
  private String region = "";
  private String metodoPago = "tarjeta demo";
  private BigDecimal subtotal;
  private BigDecimal costoEnvio;
  private BigDecimal total;
  private String claveCompra;
  private String firmaCompra;
  @Version private long version;

  @OneToMany(mappedBy = "pedido", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<PedidoItem> items = new ArrayList<>();
}
