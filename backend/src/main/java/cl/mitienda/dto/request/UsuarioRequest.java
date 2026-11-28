package cl.mitienda.dto.request;

import jakarta.validation.constraints.*;

public record UsuarioRequest(
    @NotBlank @Size(max = 80) String nombre,
    @Size(max = 100) String apellidos,
    @NotBlank @Email @Size(max = 150) String email,
    @Size(max = 128) String password,
    @NotBlank @Pattern(regexp = "admin|vendedor|cliente") String rol,
    @Size(max = 15) String run,
    @Size(max = 10) String fechaNacimiento,
    @Size(max = 100) String region,
    @Size(max = 100) String comuna,
    @Size(max = 300) String direccion) {}
