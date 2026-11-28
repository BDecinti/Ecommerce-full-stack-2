package cl.mitienda;

import static cl.mitienda.ApiDtos.*;

import java.math.BigDecimal;
import java.time.*;
import java.util.*;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class PedidosService {
  private final ProductoRepository productos;
  private final PedidoRepository pedidos;
  private final UsuarioRepository usuarios;
  private final Clock clock;

  public PedidosService(ProductoRepository p, PedidoRepository o, UsuarioRepository u, Clock c) {
    productos = p;
    pedidos = o;
    usuarios = u;
    clock = c;
  }

  @Transactional(readOnly = true)
  public List<PedidoView> listar(Long user, boolean personal) {
    return (personal
            ? pedidos.findByUsuarioIdOrderByIdDesc(user)
            : pedidos.findAllByOrderByIdDesc())
        .stream().map(Vistas::pedido).toList();
  }

  @Transactional(readOnly = true)
  public PedidoView obtener(Long id, Long user, boolean personal) {
    Pedido p = pedidos.findById(id).orElseThrow(() -> ApiException.noExiste("Pedido"));
    if (personal && !Objects.equals(p.getUsuarioId(), user))
      throw new ApiException(
          HttpStatus.FORBIDDEN, "PEDIDO_AJENO", "No tienes permiso para consultar este pedido.");
    return Vistas.pedido(p);
  }

  public PedidoView comprar(Long user, String clave, CompraRequest data) {
    validarTarjeta(data.tarjeta());
    return crear(user, clave, data.items(), data.entrega(), "tarjeta demo");
  }

  public PedidoView manual(String clave, PedidoManualRequest d) {
    Usuario u =
        usuarios
            .findByEmailIgnoreCase(d.usuario().trim())
            .filter(Usuario::isActivo)
            .orElseThrow(() -> ApiException.invalido("Selecciona un cliente registrado."));
    return crear(u.getId(), clave, d.items(), d.entrega(), d.metodoPago());
  }

  private PedidoView crear(
      Long user, String clave, List<ItemRequest> items, EntregaRequest entrega, String metodo) {
    if (clave == null || !clave.matches("[A-Za-z0-9-]{16,80}"))
      throw ApiException.invalido("Se requiere una clave de compra válida en Idempotency-Key.");
    validarEntrega(entrega);
    var cantidades = new TreeMap<Long, Integer>();
    for (ItemRequest item : items) {
      if (cantidades.put(item.id(), item.cantidad()) != null)
        throw ApiException.invalido("No repitas un producto dentro del pedido.");
    }
    String key = user + ":" + clave;
    String firma = AuthService.sha256(cantidades + "|" + entrega.toString() + "|" + metodo);
    // Todos los procesos bloquean los productos en el mismo orden para evitar interbloqueos.
    var locked = new ArrayList<Producto>();
    for (Long id : cantidades.keySet())
      locked.add(productos.bloquear(id).orElseThrow(() -> ApiException.noExiste("Producto")));
    var anterior = pedidos.findByClaveCompra(key);
    if (anterior.isPresent()) {
      if (!anterior.get().getFirmaCompra().equals(firma))
        throw ApiException.conflicto("La clave de compra ya corresponde a otros datos.");
      return Vistas.pedido(anterior.get());
    }
    Usuario u =
        usuarios.findById(user).filter(Usuario::isActivo).orElseThrow(ApiException::noAutorizado);
    Pedido pedido = new Pedido();
    pedido.setUsuarioId(user);
    pedido.setUsuario(u.getEmail());
    pedido.setFecha(clock.instant());
    pedido.setClaveCompra(key);
    pedido.setFirmaCompra(firma);
    pedido.setNombre(entrega.nombre().trim());
    pedido.setEmail(entrega.email().trim().toLowerCase(Locale.ROOT));
    pedido.setTelefono(entrega.telefono().trim());
    pedido.setTipoEntrega(entrega.tipoEntrega());
    pedido.setMetodoPago(metodo);
    boolean envio = entrega.tipoEntrega().equals("envio");
    pedido.setDireccion(envio ? entrega.direccion().trim() : "");
    pedido.setComuna(envio ? entrega.comuna().trim() : "");
    pedido.setRegion(envio ? entrega.region().trim() : "");
    BigDecimal subtotal = BigDecimal.ZERO;
    for (Producto p : locked) {
      int cantidad = cantidades.get(p.getId());
      if (!p.isActivo() || p.getStock() < cantidad)
        throw ApiException.conflicto(
            "Cambió la disponibilidad de " + p.getNombre() + ". Revisa tu carrito.");
      PedidoItem linea = new PedidoItem();
      linea.setPedido(pedido);
      linea.setProductoId(p.getId());
      linea.setNombre(p.getNombre());
      linea.setImagen(p.getImagen());
      linea.setPrecio(p.getPrecio());
      linea.setCantidad(cantidad);
      pedido.getItems().add(linea);
      subtotal = subtotal.add(p.getPrecio().multiply(BigDecimal.valueOf(cantidad)));
      p.setStock(p.getStock() - cantidad);
    }
    BigDecimal costo =
        envio && subtotal.compareTo(BigDecimal.valueOf(100000)) < 0
            ? BigDecimal.valueOf(4990)
            : BigDecimal.ZERO;
    pedido.setSubtotal(subtotal);
    pedido.setCostoEnvio(costo);
    pedido.setTotal(subtotal.add(costo));
    return Vistas.pedido(pedidos.saveAndFlush(pedido));
  }

  private void validarEntrega(EntregaRequest d) {
    if (!d.telefono().replaceAll("\\D", "").matches("(?:56)?9\\d{8}"))
      throw ApiException.invalido("Ingresa un celular chileno válido.");
    if (d.tipoEntrega().equals("envio")
        && (Vistas.limpio(d.direccion()).isEmpty()
            || Vistas.limpio(d.comuna()).isEmpty()
            || Vistas.limpio(d.region()).isEmpty()))
      throw ApiException.invalido("Completa dirección, comuna y región para el envío.");
  }

  private void validarTarjeta(TarjetaRequest t) {
    String numero = t.numero().replaceAll("\\s", "");
    if (!List.of("4242424242424242", "4000000000000002").contains(numero))
      throw ApiException.invalido("Usa una de las dos tarjetas de demostración indicadas.");
    String[] partes = t.vencimiento().split("/");
    YearMonth fin = YearMonth.of(2000 + Integer.parseInt(partes[1]), Integer.parseInt(partes[0]));
    if (fin.isBefore(YearMonth.now(clock)))
      throw ApiException.invalido("La tarjeta de prueba está vencida.");
    if (numero.equals("4000000000000002"))
      throw new ApiException(
          HttpStatus.PAYMENT_REQUIRED,
          "PAGO_RECHAZADO",
          "La tarjeta de demostración simuló un rechazo.");
  }

  public PedidoView cambiarEstado(Long id, String estado) {
    Pedido p = pedidos.bloquear(id).orElseThrow(() -> ApiException.noExiste("Pedido"));
    if (p.getEstado().equals(estado)) return Vistas.pedido(p);
    if (p.getEstado().equals("cancelado") || p.getEstado().equals("entregado"))
      throw ApiException.conflicto("El pedido está en un estado final y no se puede modificar.");
    if (estado.equals("cancelado")) {
      var sorted =
          p.getItems().stream().sorted(Comparator.comparing(PedidoItem::getProductoId)).toList();
      for (PedidoItem item : sorted) {
        Producto producto =
            productos
                .bloquear(item.getProductoId())
                .orElseThrow(() -> ApiException.noExiste("Producto"));
        producto.setStock(producto.getStock() + item.getCantidad());
      }
    }
    p.setEstado(estado);
    return Vistas.pedido(p);
  }

  public void eliminar(Long id) {
    Pedido p = pedidos.findById(id).orElseThrow(() -> ApiException.noExiste("Pedido"));
    if (!p.getEstado().equals("cancelado"))
      throw ApiException.conflicto("Solo se pueden eliminar pedidos cancelados.");
    pedidos.delete(p);
  }
}
