package cl.mitienda.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.Map;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@Tag(name = "2. Catálogo y gestión")
public class SaludController {
  @GetMapping("/health")
  @Operation(summary = "Comprobar disponibilidad de la API")
  public Map<String, String> health() {
    return Map.of("status", "UP", "application", "MiTienda API");
  }
}
