package cl.mitienda;

import io.swagger.v3.oas.models.*;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.*;

@Configuration
public class OpenApiConfig {
  @Bean
  OpenAPI documentacion() {
    return new OpenAPI()
        .info(
            new Info()
                .title("MiTienda · API REST")
                .version("2.0.0")
                .description(
                    "Catálogo, usuarios y pedidos con base de datos. Usa GET /api/auth/csrf antes"
                        + " de formularios; inicia sesión y pega accessToken en Authorize para los"
                        + " endpoints protegidos. Los permisos también se validan en el servidor."))
        .components(
            new Components()
                .addSecuritySchemes(
                    "bearerAuth",
                    new SecurityScheme()
                        .type(SecurityScheme.Type.HTTP)
                        .scheme("bearer")
                        .bearerFormat("JWT")));
  }
}
