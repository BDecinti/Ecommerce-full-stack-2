package cl.mitienda.dto.response;

import java.time.Instant;

public record ConsultaView(
    Long id, String nombre, String email, String asunto, String comentario, Instant fecha) {}
