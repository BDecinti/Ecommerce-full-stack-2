package cl.mitienda;

import java.util.*;
import org.springframework.dao.*;
import org.springframework.http.*;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

@RestControllerAdvice
public class ApiErrorHandler {
  @ExceptionHandler(ApiException.class)
  ResponseEntity<ProblemDetail> api(ApiException e) {
    ProblemDetail p = ProblemDetail.forStatusAndDetail(e.status, e.getMessage());
    p.setProperty("code", e.code);
    return ResponseEntity.status(e.status).body(p);
  }

  @ExceptionHandler(MethodArgumentNotValidException.class)
  ResponseEntity<ProblemDetail> validation(MethodArgumentNotValidException e) {
    ProblemDetail p =
        ProblemDetail.forStatusAndDetail(
            HttpStatus.BAD_REQUEST, "Revisa los campos del formulario.");
    Map<String, String> fields = new LinkedHashMap<>();
    e.getBindingResult()
        .getFieldErrors()
        .forEach(f -> fields.put(f.getField(), f.getDefaultMessage()));
    p.setProperty("errors", fields);
    p.setProperty("code", "VALIDACION");
    return ResponseEntity.badRequest().body(p);
  }

  @ExceptionHandler(HttpMessageNotReadableException.class)
  ResponseEntity<ProblemDetail> unreadable() {
    return ResponseEntity.badRequest()
        .body(
            ProblemDetail.forStatusAndDetail(
                HttpStatus.BAD_REQUEST,
                "El contenido enviado no es válido o contiene campos no permitidos."));
  }

  @ExceptionHandler({
    DataIntegrityViolationException.class,
    OptimisticLockingFailureException.class,
    PessimisticLockingFailureException.class
  })
  ResponseEntity<ProblemDetail> conflict() {
    return ResponseEntity.status(409)
        .body(
            ProblemDetail.forStatusAndDetail(
                HttpStatus.CONFLICT,
                "El registro cambió o existe una dependencia. Actualiza los datos e intenta"
                    + " nuevamente."));
  }

  @ExceptionHandler(AccessDeniedException.class)
  ResponseEntity<ProblemDetail> forbidden() {
    return ResponseEntity.status(403)
        .body(
            ProblemDetail.forStatusAndDetail(
                HttpStatus.FORBIDDEN, "Tu cuenta no tiene permiso para realizar esta acción."));
  }
}
