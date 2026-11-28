package cl.mitienda;

import static cl.mitienda.ApiDtos.*;

import java.util.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class CatalogoService {
  private final ProductoRepository productos;
  private final CategoriaRepository categorias;

  public CatalogoService(ProductoRepository p, CategoriaRepository c) {
    productos = p;
    categorias = c;
  }

  @Transactional(readOnly = true)
  public List<ProductoView> productos() {
    return productos.findByActivoTrueOrderByIdAsc().stream().map(Vistas::producto).toList();
  }

  @Transactional(readOnly = true)
  public ProductoView producto(Long id) {
    return Vistas.producto(buscar(id));
  }

  Producto buscar(Long id) {
    return productos
        .findById(id)
        .filter(Producto::isActivo)
        .orElseThrow(() -> ApiException.noExiste("Producto"));
  }

  public ProductoView guardar(Long id, ProductoRequest d) {
    Producto p =
        id == null
            ? new Producto()
            : productos
                .bloquear(id)
                .filter(Producto::isActivo)
                .orElseThrow(() -> ApiException.noExiste("Producto"));
    if (!categorias.existsById(d.categoriaId()))
      throw ApiException.invalido("La categoría indicada no existe.");
    if (productos.existsByCodigoIgnoreCaseAndIdNot(d.codigo().trim(), id == null ? -1L : id))
      throw ApiException.conflicto("El código de producto ya existe.");
    String image = Vistas.limpio(d.imagen());
    if (!image.isEmpty() && !image.startsWith("img/") && !image.matches("https://[^\\s]+"))
      throw ApiException.invalido("Usa una imagen local de img/ o una URL HTTPS.");
    p.setCodigo(d.codigo().trim());
    p.setNombre(d.nombre().trim());
    p.setMarca(Vistas.limpio(d.marca()));
    p.setDescripcion(Vistas.limpio(d.descripcion()));
    p.setImagen(image.isEmpty() ? "img/placeholder.svg" : image);
    p.setPrecio(d.precio());
    p.setStock(d.stock());
    p.setStockCritico(d.stockCritico());
    p.setCategoriaId(d.categoriaId());
    p.setDestacado(d.destacado());
    return Vistas.producto(productos.saveAndFlush(p));
  }

  public void eliminarProducto(Long id) {
    Producto p =
        productos
            .bloquear(id)
            .filter(Producto::isActivo)
            .orElseThrow(() -> ApiException.noExiste("Producto"));
    p.setActivo(false);
  }

  @Transactional(readOnly = true)
  public List<CategoriaView> categorias() {
    return categorias.findAllByOrderByIdAsc().stream().map(Vistas::categoria).toList();
  }

  public CategoriaView guardarCategoria(Long id, CategoriaRequest d) {
    Categoria c =
        id == null
            ? new Categoria()
            : categorias.findById(id).orElseThrow(() -> ApiException.noExiste("Categoría"));
    String nombre = d.nombre().trim();
    Long padre = d.padreId();
    if (padre != null) {
      Categoria p =
          categorias
              .findById(padre)
              .orElseThrow(() -> ApiException.invalido("La categoría principal no existe."));
      if (Objects.equals(padre, id)
          || p.getPadreId() != null
          || (id != null && categorias.existsByPadreId(id)))
        throw ApiException.invalido(
            "Las categorías admiten dos niveles y no pueden contener ciclos.");
    }
    if (categorias.findAll().stream()
        .anyMatch(x ->
            !Objects.equals(x.getId(), id)
                && Objects.equals(x.getPadreId(), padre)
                && x.getNombre().equalsIgnoreCase(nombre)))
      throw ApiException.conflicto("Ya existe una categoría con ese nombre en el mismo nivel.");
    c.setNombre(nombre);
    c.setPadreId(padre);
    return Vistas.categoria(categorias.save(c));
  }

  public void eliminarCategoria(Long id) {
    if (!categorias.existsById(id)) throw ApiException.noExiste("Categoría");
    if (categorias.existsByPadreId(id) || productos.existsByCategoriaIdAndActivoTrue(id))
      throw ApiException.conflicto(
          "No se puede eliminar una categoría con subcategorías o productos.");
    // Los productos retirados también conservan la relación histórica.
    if (productos.findAll().stream().anyMatch(p -> Objects.equals(p.getCategoriaId(), id)))
      throw ApiException.conflicto("La categoría forma parte del historial de productos.");
    categorias.deleteById(id);
  }
}
