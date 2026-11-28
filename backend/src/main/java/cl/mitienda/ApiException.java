package cl.mitienda;

import org.springframework.http.HttpStatus;

public class ApiException extends RuntimeException {
  final HttpStatus status;
  final String code;

  public ApiException(HttpStatus status, String code, String message) {
    super(message);
    this.status = status;
    this.code = code;
  }

  public static ApiException noExiste(String recurso) {
    return new ApiException(HttpStatus.NOT_FOUND, "NO_ENCONTRADO", recurso + " no encontrado.");
  }

  public static ApiException conflicto(String message) {
    return new ApiException(HttpStatus.CONFLICT, "CONFLICTO", message);
  }

  public static ApiException invalido(String message) {
    return new ApiException(HttpStatus.BAD_REQUEST, "DATOS_INVALIDOS", message);
  }

  public static ApiException noAutorizado() {
    return new ApiException(
        HttpStatus.UNAUTHORIZED, "SESION_REQUERIDA", "Inicia sesión para continuar.");
  }
}
