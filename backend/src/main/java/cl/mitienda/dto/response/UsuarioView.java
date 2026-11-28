package cl.mitienda.dto.response;

public record UsuarioView(
    Long id,
    String nombre,
    String apellidos,
    String email,
    String rol,
    String run,
    String fechaNacimiento,
    String region,
    String comuna,
    String direccion,
    boolean activo) {}
