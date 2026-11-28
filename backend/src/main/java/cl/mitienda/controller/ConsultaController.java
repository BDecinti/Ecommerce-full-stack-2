package cl.mitienda.controller;

import cl.mitienda.dto.DtoMapper;
import cl.mitienda.dto.request.ConsultaRequest;
import cl.mitienda.dto.response.ConsultaView;
import cl.mitienda.model.Consulta;
import cl.mitienda.repository.ConsultaRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import java.util.Locale;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/consultas")
@Tag(name = "2. Catálogo y gestión")
public class ConsultaController {
  private final ConsultaRepository consultas;

  public ConsultaController(ConsultaRepository q) {
    consultas = q;
  }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  @Operation(summary = "Guardar una consulta de contacto en la base de datos")
  public ConsultaView consulta(@Valid @RequestBody ConsultaRequest d) {
    Consulta c = new Consulta();
    c.setNombre(d.nombre().trim());
    c.setEmail(d.email().trim().toLowerCase(Locale.ROOT));
    c.setAsunto(DtoMapper.limpio(d.asunto()));
    c.setComentario(d.comentario().trim());
    consultas.save(c);
    return consultaView(c);
  }

  @GetMapping
  @PreAuthorize("hasRole('ADMIN')")
  @SecurityRequirement(name = "bearerAuth")
  @Operation(summary = "Listar consultas recibidas · administrador")
  public List<ConsultaView> consultas() {
    return consultas.findAllByOrderByIdDesc().stream().map(this::consultaView).toList();
  }

  private ConsultaView consultaView(Consulta c) {
    return new ConsultaView(
        c.getId(), c.getNombre(), c.getEmail(), c.getAsunto(), c.getComentario(), c.getFecha());
  }
}
