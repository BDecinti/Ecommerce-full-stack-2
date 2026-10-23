import { filtrosIniciales } from "../utils/filtrarProductos.js";
import "../styles/product-filters.css";

// Panel de filtros (marca, precio, disponibilidad y orden). Solo muestra los controles:
// el estado vive en la página, que recibe cada cambio con onChange(nuevosFiltros).
export default function ProductFilters({ filtros, onChange, marcas }) {
  const cambiar = (campo, valor) => onChange({ ...filtros, [campo]: valor });

  const alternarMarca = (marca) =>
    cambiar(
      "marcas",
      filtros.marcas.includes(marca)
        ? filtros.marcas.filter((m) => m !== marca)
        : [...filtros.marcas, marca],
    );

  return (
    <aside className="product-filters" aria-label="Filtros">
      <div className="product-filters-cabecera">
        <h2>Filtros</h2>
        <button
          type="button"
          className="product-filters-limpiar"
          onClick={() => onChange(filtrosIniciales)}
        >
          Limpiar
        </button>
      </div>

      <div className="product-filters-grupo">
        <label htmlFor="buscar-en-categoria">Buscar en esta selección</label>
        <input
          id="buscar-en-categoria"
          type="search"
          value={filtros.busqueda || ""}
          onChange={(e) => cambiar("busqueda", e.target.value)}
          placeholder="Nombre, marca o código"
        />
      </div>
      <div className="product-filters-grupo">
        <label htmlFor="orden">Ordenar por</label>
        <select
          id="orden"
          value={filtros.orden}
          onChange={(e) => cambiar("orden", e.target.value)}
        >
          <option value="">Relevancia</option>
          <option value="precio-asc">Precio: menor a mayor</option>
          <option value="precio-desc">Precio: mayor a menor</option>
          <option value="nombre">Nombre (A-Z)</option>
        </select>
      </div>

      {filtros.precioMin !== "" &&
        filtros.precioMax !== "" &&
        Number(filtros.precioMin) > Number(filtros.precioMax) && (
          <p role="alert">El precio mínimo supera al máximo.</p>
        )}
      <fieldset className="product-filters-grupo">
        <legend>Precio</legend>
        <div className="product-filters-precio">
          <input
            type="number"
            min="0"
            placeholder="Mínimo"
            aria-label="Precio mínimo"
            value={filtros.precioMin}
            onChange={(e) => cambiar("precioMin", e.target.value)}
          />
          <span>–</span>
          <input
            type="number"
            min="0"
            placeholder="Máximo"
            aria-label="Precio máximo"
            value={filtros.precioMax}
            onChange={(e) => cambiar("precioMax", e.target.value)}
          />
        </div>
      </fieldset>

      {marcas.length > 0 && (
        <fieldset className="product-filters-grupo">
          <legend>Marca</legend>
          {marcas.map(({ marca, cantidad }) => (
            <label className="product-filters-opcion" key={marca}>
              <input
                type="checkbox"
                checked={filtros.marcas.includes(marca)}
                onChange={() => alternarMarca(marca)}
              />
              <span>{marca}</span>
              <small>{cantidad}</small>
            </label>
          ))}
        </fieldset>
      )}

      <label className="product-filters-opcion">
        <input
          type="checkbox"
          checked={filtros.soloDisponibles}
          onChange={(e) => cambiar("soloDisponibles", e.target.checked)}
        />
        <span>Solo con stock</span>
      </label>
    </aside>
  );
}
