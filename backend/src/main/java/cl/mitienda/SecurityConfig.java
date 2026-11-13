package cl.mitienda;

import com.nimbusds.jose.jwk.source.ImmutableSecret;
import java.nio.file.*;
import java.security.SecureRandom;
import java.time.Clock;
import java.util.*;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.*;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.*;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.csrf.*;
import org.springframework.web.cors.*;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {
  @Bean
  Clock clock() {
    return Clock.systemUTC();
  }

  @Bean
  PasswordEncoder passwords() {
    return new BCryptPasswordEncoder(12);
  }

  @Bean
  SecretKey jwtKey(
      @Value("${mitienda.security.jwt-secret}") String configured,
      @Value("${mitienda.security.key-file}") String keyFile)
      throws Exception {
    byte[] key;
    if (!configured.isBlank()) {
      key = configured.getBytes(java.nio.charset.StandardCharsets.UTF_8);
      if (key.length < 32)
        throw new IllegalStateException("MITIENDA_JWT_SECRET debe tener al menos 32 bytes.");
    } else {
      Path path = Path.of(keyFile);
      if (Files.exists(path)) key = Base64.getDecoder().decode(Files.readString(path).trim());
      else {
        key = new byte[64];
        new SecureRandom().nextBytes(key);
        Path parent = path.toAbsolutePath().getParent();
        Files.createDirectories(parent);
        Files.writeString(
            path, Base64.getEncoder().encodeToString(key), StandardOpenOption.CREATE_NEW);
      }
    }
    return new SecretKeySpec(key, "HmacSHA256");
  }

  @Bean
  JwtEncoder encoder(SecretKey key) {
    return new NimbusJwtEncoder(new ImmutableSecret<>(key));
  }

  @Bean
  JwtDecoder decoder(SecretKey key) {
    NimbusJwtDecoder decoder =
        NimbusJwtDecoder.withSecretKey(key).macAlgorithm(MacAlgorithm.HS256).build();
    decoder.setJwtValidator(JwtValidators.createDefaultWithIssuer("https://mitienda.local"));
    return decoder;
  }

  @Bean
  SecurityFilterChain security(
      HttpSecurity http,
      JwtAuthFilter jwt,
      @Value("${mitienda.security.allowed-origins}") String origins,
      @Value("${mitienda.security.secure-cookie}") boolean secure)
      throws Exception {
    CookieCsrfTokenRepository csrf = CookieCsrfTokenRepository.withHttpOnlyFalse();
    csrf.setCookieCustomizer(c -> c.path("/").sameSite("Strict").secure(secure));
    CorsConfiguration cors = new CorsConfiguration();
    cors.setAllowedOrigins(Arrays.stream(origins.split(",")).map(String::trim).toList());
    cors.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
    cors.setAllowedHeaders(
        List.of("Authorization", "Content-Type", "X-XSRF-TOKEN", "Idempotency-Key"));
    cors.setAllowCredentials(true);
    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", cors);
    return http.cors(c -> c.configurationSource(source))
        .csrf(c ->
            c.csrfTokenRepository(csrf)
                .csrfTokenRequestHandler(new CsrfTokenRequestAttributeHandler()))
        .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
        .authorizeHttpRequests(a ->
            a.requestMatchers(
                    "/api/auth/csrf",
                    "/api/auth/login",
                    "/api/auth/registro",
                    "/api/auth/refresh",
                    "/api/auth/logout",
                    "/api/health")
                .permitAll()
                .requestMatchers(
                    org.springframework.http.HttpMethod.GET,
                    "/api/productos/**",
                    "/api/categorias/**",
                    "/v3/api-docs/**",
                    "/swagger-ui/**",
                    "/swagger-ui.html")
                .permitAll()
                .requestMatchers(org.springframework.http.HttpMethod.POST, "/api/consultas")
                .permitAll()
                .requestMatchers("/api/**")
                .authenticated()
                .anyRequest()
                .permitAll())
        .exceptionHandling(e ->
            e.authenticationEntryPoint(
                    (req, res, ex) -> {
                      res.setStatus(401);
                      res.setContentType("application/problem+json;charset=UTF-8");
                      res.getWriter()
                          .write(
                              "{\"status\":401,\"code\":\"SESION_REQUERIDA\",\"detail\":\"Inicia"
                                  + " sesión para continuar.\"}");
                    })
                .accessDeniedHandler((req, res, ex) -> {
                  res.setStatus(403);
                  res.setContentType("application/problem+json;charset=UTF-8");
                  res.getWriter()
                      .write(
                          "{\"status\":403,\"code\":\"ACCESO_DENEGADO\",\"detail\":\"Acceso"
                              + " denegado o comprobación CSRF no válida.\"}");
                }))
        .addFilterBefore(jwt, UsernamePasswordAuthenticationFilter.class)
        .build();
  }
}
