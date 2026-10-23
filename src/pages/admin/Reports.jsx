import { useState } from "react";
import useTitulo from "../../hooks/useTitulo.js";
import { usePedidos } from "../../context/PedidoContext.jsx";
import { useProductos } from "../../context/ProductContext.jsx";
import { useCategorias } from "../../context/CategoryContext.jsx";
import AdminTitle from "../../components/admin/AdminTitle.jsx";
import { formatearPrecio } from "../../data/productos.js";
import {
  granularidades,
  inicioPeriodo,
  desplazar,
  haceUnAnio,
  ventasValidas,
  enRango,
  resumen,
  variacion,
  serieVentas,
  desgloseVentas,
  rankingProductos,
} from "../../utils/reporteVentas.js";
import "../../styles/admin-reports.css";

const fechaCorta = (d) => d.toLocaleDateString("es-CL", { dateStyle: "short" });

// "2026-10-19" (valor de input date) <-> Date local
const aTexto = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const aFecha = (texto) => {
  const [a, m, d] = texto.split("-").map(Number);
  return new Date(a, m - 1, d);
};

// Nombre legible de un período según la granularidad
function etiquetaPeriodo(desde, gran) {
  if (gran === "dia") return fechaCorta(desde);
  if (gran === "semana") return `${fechaCorta(desde)} al ${fechaCorta(desplazar(desde, "dia", 6))}`;
  return desde.toLocaleDateString("es-CL", { month: "long", year: "numeric" });
}

function Variacion({ actual, base }) {
  const v = variacion(actual, base);
  if (v === null) return <span className="rep-var neutro">{actual > 0 ? "Nuevo" : "—"}</span>;
  const clase = v > 0 ? "sube" : v < 0 ? "baja" : "neutro";
  return (
    <span className={`rep-var ${clase}`}>
      {v > 0 ? "▲" : v < 0 ? "▼" : "="} {Math.abs(v).toFixed(1)}%
    </span>
  );
}

function TablaDesglose({ titulo, filas, columna }) {
  return (
    <article className="card">
      <h2>{titulo}</h2>
      {filas.length === 0 ? (
        <p className="dash-vacio">Sin ventas en el período.</p>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>{columna}</th>
                <th>Unidades</th>
                <th>Monto</th>
              </tr>
            </thead>
            <tbody>
              {filas.map((f) => (
                <tr key={f.clave}>
                  <td>{f.nombre}</td>
                  <td>{f.unidades}</td>
                  <td>{formatearPrecio(f.monto)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </article>
  );
}

function TablaRanking({ titulo, filas }) {
  return (
    <article className="card">
      <h2>{titulo}</h2>
      {filas.length === 0 ? (
        <p className="dash-vacio">Sin ventas en el período.</p>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Producto</th>
                <th>Unidades</th>
                <th>Monto</th>
              </tr>
            </thead>
            <tbody>
              {filas.map((f) => (
                <tr key={f.clave}>
                  <td>{f.nombre}</td>
                  <td>{f.unidades}</td>
                  <td>{formatearPrecio(f.monto)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </article>
  );
}

// Reporte de ventas: por día, semana o mes, con desglose y comparación con períodos anteriores.
export default function Reports() {
  useTitulo("Administrador - Reportes");
  const { pedidos } = usePedidos();
  const { productos } = useProductos();
  const { obtener } = useCategorias();

  const [gran, setGran] = useState("mes");
  const [referencia, setReferencia] = useState(() => aTexto(new Date()));

  const ventas = ventasValidas(pedidos);
  const inicio = inicioPeriodo(aFecha(referencia || aTexto(new Date())), gran);
  const fin = desplazar(inicio, gran, 1);

  const inicioAnterior = desplazar(inicio, gran, -1);
  const inicioAnio = haceUnAnio(inicio);
  const finAnio = haceUnAnio(fin);

  const actual = resumen(enRango(ventas, inicio, fin));
  const anterior = resumen(enRango(ventas, inicioAnterior, inicio));
  const anioPasado = resumen(enRango(ventas, inicioAnio, finAnio));

  const serie = serieVentas(ventas, gran, inicio);
  const nombreCategoria = (id) => obtener(id)?.nombre ?? "Sin categoría";
  const desglose = desgloseVentas(enRango(ventas, inicio, fin), productos, nombreCategoria);
  const ranking = rankingProductos(desglose.vendidos, productos);

  const metricas = [
    { nombre: "Monto vendido", clave: "monto", formato: formatearPrecio },
    { nombre: "Cantidad de pedidos", clave: "cantidad", formato: (n) => n },
    { nombre: "Ticket promedio", clave: "ticket", formato: formatearPrecio },
  ];

  return (
    <>
      <AdminTitle titulo="Reportes" descripcion="Reporte de ventas (sin contar pedidos cancelados)." />

      <section className="card rep-filtros">
        <label>
          Agrupar por
          <select value={gran} onChange={(e) => setGran(e.target.value)}>
            {granularidades.map((g) => (
              <option key={g.valor} value={g.valor}>
                {g.etiqueta}
              </option>
            ))}
          </select>
        </label>
        <label>
          Fecha de referencia
          <input type="date" value={referencia} onChange={(e) => setReferencia(e.target.value)} />
        </label>
        <p className="rep-periodo">
          Período analizado: <strong>{etiquetaPeriodo(inicio, gran)}</strong>
        </p>
      </section>

      <section className="card">
        <h2>Comparación con otros períodos</h2>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th></th>
                <th>Actual</th>
                <th>Período anterior ({etiquetaPeriodo(inicioAnterior, gran)})</th>
                <th>Mismo período año pasado ({etiquetaPeriodo(inicioAnio, gran)})</th>
              </tr>
            </thead>
            <tbody>
              {metricas.map((m) => (
                <tr key={m.clave}>
                  <td>{m.nombre}</td>
                  <td>
                    <strong>{m.formato(actual[m.clave])}</strong>
                  </td>
                  <td>
                    {m.formato(anterior[m.clave])} <Variacion actual={actual[m.clave]} base={anterior[m.clave]} />
                  </td>
                  <td>
                    {m.formato(anioPasado[m.clave])} <Variacion actual={actual[m.clave]} base={anioPasado[m.clave]} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="card">
        <h2>Ventas por {granularidades.find((g) => g.valor === gran).etiqueta.toLowerCase()}</h2>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Período</th>
                <th>Monto</th>
                <th>Pedidos</th>
                <th>Ticket promedio</th>
              </tr>
            </thead>
            <tbody>
              {[...serie].reverse().map((f) => (
                <tr key={f.desde.getTime()}>
                  <td>{etiquetaPeriodo(f.desde, gran)}</td>
                  <td>{formatearPrecio(f.monto)}</td>
                  <td>{f.cantidad}</td>
                  <td>{formatearPrecio(f.ticket)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rep-grid">
        <TablaDesglose titulo="Ventas por categoría" filas={desglose.categorias} columna="Categoría" />
        <TablaDesglose titulo="Ventas por marca" filas={desglose.marcas} columna="Marca" />
      </section>

      <section className="rep-grid">
        <TablaDesglose titulo="Ventas por producto" filas={desglose.productos} columna="Producto" />
        <div className="rep-columna">
          <TablaRanking titulo="Productos más vendidos" filas={ranking.mas} />
          <TablaRanking titulo="Productos menos vendidos" filas={ranking.menos} />
        </div>
      </section>
    </>
  );
}
