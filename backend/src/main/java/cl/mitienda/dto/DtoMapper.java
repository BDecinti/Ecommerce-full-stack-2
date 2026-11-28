package cl.mitienda.dto;

import cl.mitienda.dto.response.CategoriaView;
import cl.mitienda.dto.response.ItemView;
import cl.mitienda.dto.response.PedidoView;
import cl.mitienda.dto.response.ProductoView;
import cl.mitienda.dto.response.UsuarioView;
import cl.mitienda.model.Categoria;
import cl.mitienda.model.Pedido;
import cl.mitienda.model.Producto;
import cl.mitienda.model.Usuario;

public final class DtoMapper {
  private DtoMapper() {}

  public static UsuarioView usuario(Usuario u) {
    return new UsuarioView(
        u.getId(),
        u.getNombre(),
        u.getApellidos(),
        u.getEmail(),
        u.getRol(),
        u.getRun(),
        u.getFechaNacimiento(),
        u.getRegion(),
        u.getComuna(),
        u.getDireccion(),
        u.isActivo());
  }

  public static CategoriaView categoria(Categoria c) {
    return new CategoriaView(c.getId(), c.getNombre(), c.getPadreId());
  }

  public static ProductoView producto(Producto p) {
    return new ProductoView(
        p.getId(),
        p.getCodigo(),
        p.getNombre(),
        p.getMarca(),
        p.getDescripcion(),
        p.getImagen(),
        p.getPrecio(),
        p.getStock(),
        p.getStockCritico(),
        p.getCategoriaId(),
        p.isDestacado());
  }

  public static PedidoView pedido(Pedido p) {
    return new PedidoView(
        p.getId(),
        p.getUsuario(),
        p.getFecha(),
        p.getEstado(),
        p.getNombre(),
        p.getEmail(),
        p.getTelefono(),
        p.getTipoEntrega(),
        p.getDireccion(),
        p.getComuna(),
        p.getRegion(),
        p.getMetodoPago(),
        p.getSubtotal(),
        p.getCostoEnvio(),
        p.getTotal(),
        true,
        p.getItems().stream()
            .map(i ->
                new ItemView(
                    i.getProductoId(),
                    i.getNombre(),
                    i.getImagen(),
                    i.getPrecio(),
                    i.getCantidad()))
            .toList());
  }

  public static String limpio(String value) {
    return value == null ? "" : value.trim();
  }
}
