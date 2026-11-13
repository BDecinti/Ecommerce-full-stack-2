package cl.mitienda;

import static cl.mitienda.ApiDtos.*;

final class Vistas {
  private Vistas() {}

  static UsuarioView usuario(Usuario u) {
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

  static CategoriaView categoria(Categoria c) {
    return new CategoriaView(c.getId(), c.getNombre(), c.getPadreId());
  }

  static ProductoView producto(Producto p) {
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

  static PedidoView pedido(Pedido p) {
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

  static String limpio(String value) {
    return value == null ? "" : value.trim();
  }
}
