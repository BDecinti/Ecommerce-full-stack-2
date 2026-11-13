package cl.mitienda;

import static cl.mitienda.ApiDtos.*;

import java.security.*;
import java.time.*;
import java.util.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {
  private final UsuarioRepository usuarios;
  private final SesionRepository sesiones;
  private final PasswordEncoder passwords;
  private final JwtEncoder encoder;
  private final Clock clock;
  private final long minutes, days;

  public AuthService(
      UsuarioRepository u,
      SesionRepository s,
      PasswordEncoder p,
      JwtEncoder e,
      Clock c,
      @Value("${mitienda.security.access-minutes}") long m,
      @Value("${mitienda.security.refresh-days}") long d) {
    usuarios = u;
    sesiones = s;
    passwords = p;
    encoder = e;
    clock = c;
    minutes = m;
    days = d;
  }

  public record Resultado(AuthView body, String refreshToken) {}

  @Transactional
  public UsuarioView registrar(RegistroRequest data) {
    String email = data.email().trim().toLowerCase(Locale.ROOT);
    if (usuarios.findByEmailIgnoreCase(email).isPresent())
      throw ApiException.conflicto("El correo ya está registrado.");
    Usuario u = new Usuario();
    u.setNombre(data.nombre().trim());
    u.setEmail(email);
    u.setPasswordHash(passwords.encode(data.password()));
    return Vistas.usuario(usuarios.save(u));
  }

  @Transactional
  public Resultado login(LoginRequest data, String anterior) {
    Usuario u = usuarios.findByEmailIgnoreCase(data.email().trim()).orElse(null);
    // Se comprueba un hash incluso para un correo inexistente.
    String hash =
        u == null
            ? "$2a$12$7EqJtq98hPqEX7fNZaFWoO5euBzdP/3eO6A7T2ukbEU5jK8RkE7Nq"
            : u.getPasswordHash();
    if (!passwords.matches(data.password(), hash) || u == null || !u.isActivo())
      throw new ApiException(
          org.springframework.http.HttpStatus.UNAUTHORIZED,
          "CREDENCIALES_INVALIDAS",
          "Correo o contraseña incorrectos.");
    revocar(anterior);
    Sesion sesion = new Sesion();
    sesion.setId(UUID.randomUUID().toString());
    sesion.setUsuario(u);
    sesion.setExpiraEn(clock.instant().plus(Duration.ofDays(days)));
    return rotar(sesion);
  }

  @Transactional
  public Resultado refresh(String token) {
    if (token == null || token.isBlank()) throw ApiException.noAutorizado();
    Sesion sesion =
        sesiones.bloquearPorToken(sha256(token)).orElseThrow(ApiException::noAutorizado);
    if (sesion.isRevocada()
        || !sesion.getUsuario().isActivo()
        || !sesion.getExpiraEn().isAfter(clock.instant())) throw ApiException.noAutorizado();
    return rotar(sesion);
  }

  private Resultado rotar(Sesion sesion) {
    byte[] bytes = new byte[48];
    new SecureRandom().nextBytes(bytes);
    String refresh = Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    sesion.setTokenHash(sha256(refresh));
    sesiones.saveAndFlush(sesion);
    Instant now = clock.instant();
    Usuario u = sesion.getUsuario();
    JwtClaimsSet claims =
        JwtClaimsSet.builder()
            .issuer("https://mitienda.local")
            .audience(List.of("mitienda-web"))
            .subject(u.getId().toString())
            .issuedAt(now)
            .expiresAt(now.plusSeconds(minutes * 60))
            .id(UUID.randomUUID().toString())
            .claim("sid", sesion.getId())
            .claim("rol", u.getRol())
            .build();
    String access =
        encoder
            .encode(JwtEncoderParameters.from(JwsHeader.with(MacAlgorithm.HS256).build(), claims))
            .getTokenValue();
    return new Resultado(new AuthView(access, "Bearer", minutes * 60, Vistas.usuario(u)), refresh);
  }

  @Transactional
  public void revocar(String token) {
    if (token == null || token.isBlank()) return;
    sesiones
        .bloquearPorToken(sha256(token))
        .ifPresent(s -> {
          s.setRevocada(true);
          sesiones.save(s);
        });
  }

  public Usuario actual(Long id) {
    return usuarios.findById(id).filter(Usuario::isActivo).orElseThrow(ApiException::noAutorizado);
  }

  static String sha256(String value) {
    try {
      return HexFormat.of()
          .formatHex(
              MessageDigest.getInstance("SHA-256")
                  .digest(value.getBytes(java.nio.charset.StandardCharsets.UTF_8)));
    } catch (NoSuchAlgorithmException e) {
      throw new IllegalStateException(e);
    }
  }
}
