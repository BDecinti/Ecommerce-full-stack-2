package cl.mitienda;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

/** Permite recargar rutas del frontend cuando se ejecuta el JAR completo. */
@Controller
public class FrontendController {
  @GetMapping({
    "/",
    "/about",
    "/blog",
    "/blog/{id}",
    "/products",
    "/products/{id}",
    "/categories",
    "/categories/{id}",
    "/ofertas",
    "/contact",
    "/login",
    "/signup",
    "/cart",
    "/checkout",
    "/payment",
    "/my-orders",
    "/admin",
    "/admin/{*path}"
  })
  public String app() {
    return "forward:/index.html";
  }
}
