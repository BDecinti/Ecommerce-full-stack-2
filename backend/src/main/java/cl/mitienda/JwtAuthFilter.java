package cl.mitienda;

import jakarta.servlet.*;
import jakarta.servlet.http.*;
import java.io.IOException;
import java.time.Clock;
import java.util.List;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.*;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {
  private final JwtDecoder decoder;
  private final SesionRepository sesiones;
  private final Clock clock;

  public JwtAuthFilter(JwtDecoder decoder, SesionRepository sesiones, Clock clock) {
    this.decoder = decoder;
    this.sesiones = sesiones;
    this.clock = clock;
  }

  @Override
  protected void doFilterInternal(
      HttpServletRequest request, HttpServletResponse response, FilterChain chain)
      throws ServletException, IOException {
    String header = request.getHeader("Authorization");
    if (header != null && header.startsWith("Bearer ")) {
      try {
        Jwt jwt = decoder.decode(header.substring(7));
        if (!jwt.getAudience().contains("mitienda-web"))
          throw new JwtException("Audiencia inválida");
        Sesion sesion =
            sesiones
                .findById(jwt.getClaimAsString("sid"))
                .orElseThrow(() -> new JwtException("Sesión inexistente"));
        Usuario usuario = sesion.getUsuario();
        if (sesion.isRevocada()
            || !sesion.getExpiraEn().isAfter(clock.instant())
            || !usuario.isActivo()
            || !usuario.getId().toString().equals(jwt.getSubject()))
          throw new JwtException("Sesión revocada");
        var auth =
            new UsernamePasswordAuthenticationToken(
                usuario.getId(),
                null,
                List.of(
                    new SimpleGrantedAuthority(
                        "ROLE_" + usuario.getRol().toUpperCase(java.util.Locale.ROOT))));
        SecurityContextHolder.getContext().setAuthentication(auth);
      } catch (JwtException | IllegalArgumentException e) {
        response.setStatus(401);
        response.setContentType("application/problem+json;charset=UTF-8");
        response
            .getWriter()
            .write(
                "{\"status\":401,\"code\":\"TOKEN_INVALIDO\",\"detail\":\"La sesión venció. Vuelve"
                    + " a iniciar sesión.\"}");
        return;
      }
    }
    chain.doFilter(request, response);
  }
}
