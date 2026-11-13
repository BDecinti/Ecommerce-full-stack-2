package cl.mitienda;

import static cl.mitienda.ApiDtos.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.time.Duration;
import java.util.Map;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@Tag(
    name = "1. Autenticación",
    description = "JWT de acceso y renovación mediante cookie HttpOnly; contraseñas BCrypt.")
public class AuthController {
  private final AuthService auth;
  private final boolean secure;
  private final long days;

  public AuthController(
      AuthService auth,
      @Value("${mitienda.security.secure-cookie}") boolean secure,
      @Value("${mitienda.security.refresh-days}") long days) {
    this.auth = auth;
    this.secure = secure;
    this.days = days;
  }

  @GetMapping("/csrf")
  @Operation(summary = "Obtener token CSRF antes de enviar formularios")
  public Map<String, String> csrf(CsrfToken csrf) {
    return Map.of("token", csrf.getToken(), "headerName", csrf.getHeaderName());
  }

  @PostMapping("/registro")
  @ResponseStatus(HttpStatus.CREATED)
  @Operation(summary = "Registrar una cuenta; siempre recibe rol cliente")
  public UsuarioView registro(@Valid @RequestBody RegistroRequest d) {
    return auth.registrar(d);
  }

  @PostMapping("/login")
  @Operation(summary = "Iniciar sesión y obtener un JWT de acceso")
  public ResponseEntity<AuthView> login(
      @Valid @RequestBody LoginRequest d,
      @CookieValue(name = "mitienda_refresh", required = false) String cookie) {
    return respuesta(auth.login(d, cookie));
  }

  @PostMapping("/refresh")
  @Operation(summary = "Restaurar sesión y rotar la cookie de renovación")
  public ResponseEntity<AuthView> refresh(
      @CookieValue(name = "mitienda_refresh", required = false) String cookie) {
    return respuesta(auth.refresh(cookie));
  }

  @PostMapping("/logout")
  @Operation(summary = "Revocar la sesión y retirar la cookie")
  public ResponseEntity<Void> logout(
      @CookieValue(name = "mitienda_refresh", required = false) String cookie) {
    auth.revocar(cookie);
    return ResponseEntity.noContent()
        .header(HttpHeaders.SET_COOKIE, cookie("", Duration.ZERO).toString())
        .build();
  }

  @GetMapping("/me")
  @Operation(summary = "Consultar la cuenta autenticada sin exponer su contraseña")
  public UsuarioView me(Authentication principal) {
    return Vistas.usuario(auth.actual((Long) principal.getPrincipal()));
  }

  private ResponseEntity<AuthView> respuesta(AuthService.Resultado r) {
    return ResponseEntity.ok()
        .header(HttpHeaders.SET_COOKIE, cookie(r.refreshToken(), Duration.ofDays(days)).toString())
        .header(HttpHeaders.CACHE_CONTROL, "no-store")
        .body(r.body());
  }

  private ResponseCookie cookie(String value, Duration maxAge) {
    return ResponseCookie.from("mitienda_refresh", value)
        .httpOnly(true)
        .secure(secure)
        .sameSite("Strict")
        .path("/api/auth")
        .maxAge(maxAge)
        .build();
  }
}
