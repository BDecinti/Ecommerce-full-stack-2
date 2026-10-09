import { Link, useParams } from "react-router-dom";
import useTitulo from "../../hooks/useTitulo.js";
import { posts } from "../../data/posts.js";
import { rutaImagen } from "../../data/productos.js";
import "../../styles/blog-detalle.css";

// Una sola página para todas las entradas del blog (antes post-1.html y post-2.html)
export default function Post() {
  const { id } = useParams();
  const post = posts.find((p) => p.id === Number(id));

  useTitulo(post ? `MiTienda - ${post.titulo}` : "MiTienda - Blogs");

  return (
    <>
      <section className="page-header">
        <h1>{post ? post.titulo : "Entrada no encontrada"}</h1>
      </section>
      <article className="container card blog-detail">
        {post && (
          <>
            <img src={rutaImagen("img/placeholder.svg")} alt="Imagen del blog" />
            {post.contenido.map((parrafo, i) => (
              <p key={i}>{parrafo}</p>
            ))}
          </>
        )}
        <Link className="btn btn-secondary" to="/blog">
          Volver a Blogs
        </Link>
      </article>
    </>
  );
}
