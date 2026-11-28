package cl.mitienda;

import java.math.BigDecimal;
import java.time.Instant;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.json.JsonMapper;

@Component
public class Semillas implements ApplicationRunner {
  private final JdbcTemplate jdbc;
  private final PasswordEncoder passwords;
  private final boolean enabled;
  private final String adminPass, clientPass, sellerPass;

  public Semillas(
      JdbcTemplate jdbc,
      PasswordEncoder passwords,
      @Value("${mitienda.seed-demo}") boolean enabled,
      @Value("${DEMO_ADMIN_PASSWORD:Admin123!}") String a,
      @Value("${DEMO_CLIENT_PASSWORD:Cliente123!}") String c,
      @Value("${DEMO_SELLER_PASSWORD:Vendedor123!}") String s) {
    this.jdbc = jdbc;
    this.passwords = passwords;
    this.enabled = enabled;
    adminPass = a;
    clientPass = c;
    sellerPass = s;
  }

  @Override
  @Transactional
  public void run(ApplicationArguments args) throws Exception {
    if (!enabled) return;
    if (jdbc.queryForObject("select count(*) from categorias", Long.class) == 0) {
      JsonNode root =
          JsonMapper.builder()
              .build()
              .readTree(new ClassPathResource("semillas-catalogo.json").getInputStream());
      for (JsonNode c : root.path("categorias"))
        jdbc.update(
            "insert into categorias(id,nombre,padre_id) values(?,?,?)",
            c.path("id").asLong(),
            c.path("nombre").asText(),
            c.path("padreId").isNull() ? null : c.path("padreId").asLong());
      for (JsonNode p : root.path("productos"))
        jdbc.update(
            "insert into"
                + " productos(id,codigo,nombre,marca,descripcion,imagen,precio,stock,stock_critico,categoria_id,destacado,activo,version)"
                + " values(?,?,?,?,?,?,?,?,?,?,?,true,0)",
            p.path("id").asLong(),
            p.path("codigo").asText(),
            p.path("nombre").asText(),
            p.path("marca").asText(),
            p.path("descripcion").asText(),
            p.path("imagen").asText(),
            BigDecimal.valueOf(p.path("precio").asLong()),
            p.path("stock").asInt(),
            p.path("stockCritico").asInt(),
            p.path("categoriaId").asLong(),
            p.path("destacado").asBoolean());
    }
    if (jdbc.queryForObject("select count(*) from usuarios", Long.class) == 0) {
      usuario(1L, "Administrador", "admin@duoc.cl", "admin", adminPass);
      usuario(2L, "Cliente", "cliente@duoc.cl", "cliente", clientPass);
      usuario(3L, "Vendedor", "vendedor@duoc.cl", "vendedor", sellerPass);
    }
  }

  private void usuario(Long id, String nombre, String email, String rol, String password) {
    if (password.length() < 8)
      throw new IllegalStateException(
          "Las contraseñas de demostración deben tener al menos 8 caracteres.");
    jdbc.update(
        "insert into usuarios(id,nombre,email,password_hash,rol,creado_en) values(?,?,?,?,?,?)",
        id,
        nombre,
        email,
        passwords.encode(password),
        rol,
        Instant.now());
  }
}
