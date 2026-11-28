package cl.mitienda;

import static org.assertj.core.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import jakarta.servlet.http.Cookie;
import java.time.*;
import java.util.*;
import java.util.concurrent.*;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.*;
import org.springframework.test.web.servlet.*;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.json.JsonMapper;

@SpringBootTest(
    properties = {
      "spring.datasource.url=jdbc:h2:mem:integration;MODE=PostgreSQL;DB_CLOSE_DELAY=-1;LOCK_TIMEOUT=10000",
      "mitienda.security.jwt-secret=clave-exclusiva-para-pruebas-integracion-0123456789",
      "mitienda.seed-demo=true"
    })
@AutoConfigureMockMvc
class ApiIntegrationTest {
  @Autowired MockMvc mvc;
  @Autowired JdbcTemplate jdbc;
  @Autowired JwtEncoder encoder;
  @Autowired JwtDecoder decoder;
  @Autowired PasswordEncoder passwords;
  @Autowired PedidosService pedidosService;
  final JsonMapper json = JsonMapper.builder().build();

  record Login(String token, Cookie cookie, String sid) {}

  Cookie csrfCookie;
  String csrfToken;

  @BeforeEach
  void limpiar() throws Exception {
    MvcResult csrfResult =
        mvc.perform(get("/api/auth/csrf")).andExpect(status().isOk()).andReturn();
    csrfCookie = csrfResult.getResponse().getCookie("XSRF-TOKEN");
    csrfToken = body(csrfResult).path("token").asText();
    jdbc.update("delete from pedido_items");
    jdbc.update("delete from pedidos");
    jdbc.update("delete from sesiones");
    jdbc.update("delete from consultas");
    jdbc.update("delete from productos where id>=1000");
    jdbc.update("delete from categorias where id>=1000");
    jdbc.update("delete from usuarios where id>=1000");
    jdbc.update("update usuarios set activo=true where id<1000");
    jdbc.update("update productos set activo=true,stock=25 where id=3");
  }

  JsonNode body(MvcResult r) throws Exception {
    return json.readTree(r.getResponse().getContentAsString());
  }

  MockHttpServletRequestBuilder content(MockHttpServletRequestBuilder req, String text) {
    return req.contentType("application/json")
        .content(text)
        .cookie(csrfCookie)
        .header("X-XSRF-TOKEN", csrfToken);
  }

  Login login(String email, String password) throws Exception {
    MvcResult result =
        mvc.perform(
                content(
                    post("/api/auth/login"),
                    "{\"email\":\"" + email + "\",\"password\":\"" + password + "\"}"))
            .andExpect(status().isOk())
            .andReturn();
    String token = body(result).path("accessToken").asText();
    Cookie cookie = result.getResponse().getCookie("mitienda_refresh");
    return new Login(token, cookie, decoder.decode(token).getClaimAsString("sid"));
  }

  Login admin() throws Exception {
    return login("admin@duoc.cl", "Admin123!");
  }

  Login cliente() throws Exception {
    return login("cliente@duoc.cl", "Cliente123!");
  }

  String compra(int cantidad, String numero) {
    return """
    {"items":[{"id":3,"cantidad":%d}],"entrega":{"nombre":"Cliente Demo","email":"cliente@duoc.cl","telefono":"+56 9 1234 5678","tipoEntrega":"envio","direccion":"Calle 123","comuna":"Santiago","region":"Metropolitana"},"tarjeta":{"numero":"%s","titular":"CLIENTE DEMO","vencimiento":"12/30","cvv":"123"}}
    """
        .formatted(cantidad, numero);
  }

  MvcResult comprar(Login login, String key, int qty) throws Exception {
    return mvc.perform(
            content(
                post("/api/pedidos")
                    .header("Authorization", "Bearer " + login.token())
                    .header("Idempotency-Key", key),
                compra(qty, "4242424242424242")))
        .andExpect(status().isCreated())
        .andReturn();
  }

  String producto() {
    return "{\"codigo\":\"TEST-100\",\"nombre\":\"Mouse"
               + " REST\",\"marca\":\"Demo\",\"descripcion\":\"Producto de"
               + " prueba\",\"imagen\":\"img/mouse.svg\",\"precio\":10000,\"stock\":3,\"stockCritico\":1,\"categoriaId\":7,\"destacado\":false}";
  }

  @Test
  void catalogoPublicoConDatosYSwagger() throws Exception {
    mvc.perform(get("/api/health"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.status").value("UP"));
    mvc.perform(get("/api/productos"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.length()").value(32));
    mvc.perform(get("/api/categorias"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.length()").value(14));
    mvc.perform(get("/v3/api-docs"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.components.securitySchemes.bearerAuth.scheme").value("bearer"));
  }

  @Test
  void registroNormalizaYNoDevuelveContrasena() throws Exception {
    MvcResult r =
        mvc.perform(
                content(
                    post("/api/auth/registro"),
                    "{\"nombre\":\"  Demo "
                        + " \",\"email\":\"NUEVO@EXAMPLE.COM\",\"password\":\"Password123!\"}"))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.rol").value("cliente"))
            .andExpect(jsonPath("$.email").value("nuevo@example.com"))
            .andExpect(jsonPath("$.password").doesNotExist())
            .andExpect(jsonPath("$.passwordHash").doesNotExist())
            .andReturn();
    String hash =
        jdbc.queryForObject(
            "select password_hash from usuarios where id=?",
            String.class,
            body(r).path("id").asLong());
    assertThat(passwords.matches("Password123!", hash)).isTrue();
    assertThat(hash).isNotEqualTo("Password123!");
  }

  @Test
  void registroRechazaCorreoDuplicado() throws Exception {
    mvc.perform(
            content(
                post("/api/auth/registro"),
                "{\"nombre\":\"Demo\",\"email\":\"CLIENTE@DUOC.CL\",\"password\":\"Password123!\"}"))
        .andExpect(status().isConflict());
  }

  @Test
  void registroNoPermiteAsignarseRol() throws Exception {
    mvc.perform(
            content(
                post("/api/auth/registro"),
                "{\"nombre\":\"Demo\",\"email\":\"nuevo@example.com\",\"password\":\"Password123!\",\"rol\":\"admin\"}"))
        .andExpect(status().isBadRequest());
  }

  @Test
  void registroRechazaContrasenaCorta() throws Exception {
    mvc.perform(
            content(
                post("/api/auth/registro"),
                "{\"nombre\":\"Demo\",\"email\":\"nuevo@example.com\",\"password\":\"abc\"}"))
        .andExpect(status().isBadRequest());
  }

  @Test
  void loginInvalidoEsGenerico() throws Exception {
    mvc.perform(
            content(
                post("/api/auth/login"),
                "{\"email\":\"cliente@duoc.cl\",\"password\":\"incorrecta\"}"))
        .andExpect(status().isUnauthorized())
        .andExpect(jsonPath("$.code").value("CREDENCIALES_INVALIDAS"));
  }

  @Test
  void loginEntregaJwtYCookiesProtegidas() throws Exception {
    Login l = cliente();
    Jwt jwt = decoder.decode(l.token());
    assertThat(jwt.getIssuer().toString()).isEqualTo("https://mitienda.local");
    assertThat(jwt.getAudience()).contains("mitienda-web");
    assertThat(jwt.getClaimAsString("rol")).isEqualTo("cliente");
    assertThat(l.cookie().isHttpOnly()).isTrue();
    assertThat(l.cookie().getPath()).isEqualTo("/api/auth");
    assertThat(l.cookie().getAttribute("SameSite")).isEqualTo("Strict");
    assertThat(l.cookie().getMaxAge()).isEqualTo(604800);
    mvc.perform(get("/api/auth/me").header("Authorization", "Bearer " + l.token()))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.email").value("cliente@duoc.cl"));
  }

  @Test
  void csrfBloqueaFormulariosSinToken() throws Exception {
    mvc.perform(
            post("/api/auth/login")
                .contentType("application/json")
                .content("{\"email\":\"admin@duoc.cl\",\"password\":\"Admin123!\"}"))
        .andExpect(status().isForbidden());
  }

  @Test
  void csrfEndpointUsaCookieSinSesionDeServidor() throws Exception {
    mvc.perform(get("/api/auth/csrf"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.token").isString())
        .andExpect(cookie().exists("XSRF-TOKEN"))
        .andExpect(cookie().doesNotExist("JSESSIONID"));
  }

  @Test
  void invitadoNoAccedeAUsuarios() throws Exception {
    mvc.perform(get("/api/usuarios")).andExpect(status().isUnauthorized());
  }

  @Test
  void clienteNoAccedeAUsuarios() throws Exception {
    Login l = cliente();
    mvc.perform(get("/api/usuarios").header("Authorization", "Bearer " + l.token()))
        .andExpect(status().isForbidden());
  }

  @Test
  void vendedorTienePermisosLimitados() throws Exception {
    Login l = login("vendedor@duoc.cl", "Vendedor123!");
    mvc.perform(get("/api/usuarios").header("Authorization", "Bearer " + l.token()))
        .andExpect(status().isForbidden());
    mvc.perform(
            content(
                post("/api/productos").header("Authorization", "Bearer " + l.token()), producto()))
        .andExpect(status().isCreated());
    mvc.perform(
            delete("/api/productos/3")
                .cookie(csrfCookie)
                .header("X-XSRF-TOKEN", csrfToken)
                .header("Authorization", "Bearer " + l.token()))
        .andExpect(status().isForbidden());
  }

  @Test
  void adminListaUsuariosSinHashes() throws Exception {
    Login l = admin();
    mvc.perform(get("/api/usuarios").header("Authorization", "Bearer " + l.token()))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$[0].passwordHash").doesNotExist())
        .andExpect(jsonPath("$[0].password").doesNotExist());
  }

  @Test
  void clienteNoPuedeCrearProductos() throws Exception {
    Login l = cliente();
    mvc.perform(
            content(
                post("/api/productos").header("Authorization", "Bearer " + l.token()), producto()))
        .andExpect(status().isForbidden());
  }

  @Test
  void crudProductoConservaRetiroHistorico() throws Exception {
    Login l = admin();
    MvcResult created =
        mvc.perform(
                content(
                    post("/api/productos").header("Authorization", "Bearer " + l.token()),
                    producto()))
            .andExpect(status().isCreated())
            .andReturn();
    long id = body(created).path("id").asLong();
    mvc.perform(
            content(
                put("/api/productos/" + id).header("Authorization", "Bearer " + l.token()),
                producto().replace("Mouse REST", "Mouse editado")))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.nombre").value("Mouse editado"));
    mvc.perform(
            delete("/api/productos/" + id)
                .cookie(csrfCookie)
                .header("X-XSRF-TOKEN", csrfToken)
                .header("Authorization", "Bearer " + l.token()))
        .andExpect(status().isNoContent());
    mvc.perform(get("/api/productos/" + id)).andExpect(status().isNotFound());
  }

  @Test
  void productoValidaStockPrecioYCodigo() throws Exception {
    Login l = admin();
    mvc.perform(
            content(
                post("/api/productos").header("Authorization", "Bearer " + l.token()),
                producto().replace("\"stock\":3", "\"stock\":-1")))
        .andExpect(status().isBadRequest());
    mvc.perform(
            content(
                post("/api/productos").header("Authorization", "Bearer " + l.token()),
                producto().replace("\"precio\":10000", "\"precio\":0")))
        .andExpect(status().isBadRequest());
    mvc.perform(
            content(
                post("/api/productos").header("Authorization", "Bearer " + l.token()), producto()))
        .andExpect(status().isCreated());
    mvc.perform(
            content(
                post("/api/productos").header("Authorization", "Bearer " + l.token()), producto()))
        .andExpect(status().isConflict());
  }

  @Test
  void categoriaCrudYReglasDeJerarquia() throws Exception {
    Login l = admin();
    MvcResult r =
        mvc.perform(
                content(
                    post("/api/categorias").header("Authorization", "Bearer " + l.token()),
                    "{\"nombre\":\"Pruebas\",\"padreId\":null}"))
            .andExpect(status().isCreated())
            .andReturn();
    long id = body(r).path("id").asLong();
    mvc.perform(
            content(
                put("/api/categorias/" + id).header("Authorization", "Bearer " + l.token()),
                "{\"nombre\":\"Editada\",\"padreId\":null}"))
        .andExpect(status().isOk());
    mvc.perform(
            content(
                put("/api/categorias/" + id).header("Authorization", "Bearer " + l.token()),
                "{\"nombre\":\"Editada\",\"padreId\":" + id + "}"))
        .andExpect(status().isBadRequest());
    mvc.perform(
            delete("/api/categorias/" + id)
                .cookie(csrfCookie)
                .header("X-XSRF-TOKEN", csrfToken)
                .header("Authorization", "Bearer " + l.token()))
        .andExpect(status().isNoContent());
  }

  @Test
  void categoriaConProductosNoSeElimina() throws Exception {
    Login l = admin();
    mvc.perform(
            delete("/api/categorias/7")
                .cookie(csrfCookie)
                .header("X-XSRF-TOKEN", csrfToken)
                .header("Authorization", "Bearer " + l.token()))
        .andExpect(status().isConflict());
  }

  @Test
  void noSePuedeEliminarUltimoAdmin() throws Exception {
    Login l = admin();
    mvc.perform(
            delete("/api/usuarios/1")
                .cookie(csrfCookie)
                .header("X-XSRF-TOKEN", csrfToken)
                .header("Authorization", "Bearer " + l.token()))
        .andExpect(status().isConflict());
  }

  @Test
  void renovarRotaCookieYRetiraTokenAnterior() throws Exception {
    Login l = cliente();
    MvcResult r =
        mvc.perform(
                post("/api/auth/refresh")
                    .cookie(csrfCookie)
                    .header("X-XSRF-TOKEN", csrfToken)
                    .cookie(l.cookie()))
            .andExpect(status().isOk())
            .andReturn();
    Cookie nueva = r.getResponse().getCookie("mitienda_refresh");
    assertThat(nueva.getValue()).isNotEqualTo(l.cookie().getValue());
    mvc.perform(
            post("/api/auth/refresh")
                .cookie(csrfCookie)
                .header("X-XSRF-TOKEN", csrfToken)
                .cookie(l.cookie()))
        .andExpect(status().isUnauthorized());
    mvc.perform(
            post("/api/auth/refresh")
                .cookie(csrfCookie)
                .header("X-XSRF-TOKEN", csrfToken)
                .cookie(nueva))
        .andExpect(status().isOk());
  }

  @Test
  void renovacionInvalidaOExpiradaEsRechazada() throws Exception {
    mvc.perform(
            post("/api/auth/refresh")
                .cookie(csrfCookie)
                .header("X-XSRF-TOKEN", csrfToken)
                .cookie(new Cookie("mitienda_refresh", "inventada")))
        .andExpect(status().isUnauthorized());
    Login l = cliente();
    jdbc.update(
        "update sesiones set expira_en=? where id=?", Instant.now().minusSeconds(60), l.sid());
    mvc.perform(
            post("/api/auth/refresh")
                .cookie(csrfCookie)
                .header("X-XSRF-TOKEN", csrfToken)
                .cookie(l.cookie()))
        .andExpect(status().isUnauthorized());
  }

  @Test
  void logoutRevocaJwtYRefresh() throws Exception {
    Login l = cliente();
    mvc.perform(
            post("/api/auth/logout")
                .cookie(csrfCookie)
                .header("X-XSRF-TOKEN", csrfToken)
                .cookie(l.cookie()))
        .andExpect(status().isNoContent())
        .andExpect(cookie().maxAge("mitienda_refresh", 0));
    mvc.perform(get("/api/auth/me").header("Authorization", "Bearer " + l.token()))
        .andExpect(status().isUnauthorized());
    mvc.perform(
            post("/api/auth/refresh")
                .cookie(csrfCookie)
                .header("X-XSRF-TOKEN", csrfToken)
                .cookie(l.cookie()))
        .andExpect(status().isUnauthorized());
  }

  @Test
  void cookieDeRenovacionNoEsTokenDeAcceso() throws Exception {
    Login l = cliente();
    mvc.perform(get("/api/usuarios").cookie(l.cookie())).andExpect(status().isUnauthorized());
  }

  @Test
  void jwtManipuladoNoEsValido() throws Exception {
    Login l = cliente();
    mvc.perform(get("/api/auth/me").header("Authorization", "Bearer " + l.token() + "a"))
        .andExpect(status().isUnauthorized());
  }

  String firmar(Login l, String issuer, String aud, Instant exp) {
    return encoder
        .encode(
            JwtEncoderParameters.from(
                JwsHeader.with(MacAlgorithm.HS256).build(),
                JwtClaimsSet.builder()
                    .issuer(issuer)
                    .audience(List.of(aud))
                    .subject("2")
                    .issuedAt(Instant.now().minusSeconds(600))
                    .expiresAt(exp)
                    .claim("sid", l.sid())
                    .build()))
        .getTokenValue();
  }

  @Test
  void jwtExpiradoEsRechazado() throws Exception {
    Login l = cliente();
    mvc.perform(
            get("/api/auth/me")
                .header(
                    "Authorization",
                    "Bearer "
                        + firmar(
                            l,
                            "https://mitienda.local",
                            "mitienda-web",
                            Instant.now().minusSeconds(300))))
        .andExpect(status().isUnauthorized());
  }

  @Test
  void jwtConAudienciaOEmisorAjenoEsRechazado() throws Exception {
    Login l = cliente();
    for (String t :
        List.of(
            firmar(l, "otro", "mitienda-web", Instant.now().plusSeconds(300)),
            firmar(l, "https://mitienda.local", "otro", Instant.now().plusSeconds(300))))
      mvc.perform(get("/api/auth/me").header("Authorization", "Bearer " + t))
          .andExpect(status().isUnauthorized());
  }

  @Test
  void compraCalculaTotalEnServidorYNoGuardaTarjeta() throws Exception {
    Login l = cliente();
    MvcResult r = comprar(l, UUID.randomUUID().toString(), 1);
    JsonNode b = body(r);
    assertThat(b.path("total").asLong()).isEqualTo(54980);
    assertThat(b.path("costoEnvio").asLong()).isEqualTo(4990);
    assertThat(jdbc.queryForObject("select stock from productos where id=3", Integer.class))
        .isEqualTo(24);
    assertThat(r.getResponse().getContentAsString())
        .doesNotContain("4242424242424242", "cvv", "titular", "vencimiento");
  }

  @Test
  void precioEnviadoPorClienteNoEsAceptado() throws Exception {
    Login l = cliente();
    String d =
        compra(1, "4242424242424242").replace("\"cantidad\":1", "\"cantidad\":1,\"precio\":1");
    mvc.perform(
            content(
                post("/api/pedidos")
                    .header("Authorization", "Bearer " + l.token())
                    .header("Idempotency-Key", UUID.randomUUID().toString()),
                d))
        .andExpect(status().isBadRequest());
  }

  @Test
  void compraUmbralDeEnvioGratis() throws Exception {
    MvcResult r = comprar(cliente(), UUID.randomUUID().toString(), 3);
    assertThat(body(r).path("costoEnvio").asLong()).isZero();
  }

  @Test
  void rechazoNoDescuentaStockNiCreaPedido() throws Exception {
    Login l = cliente();
    mvc.perform(
            content(
                post("/api/pedidos")
                    .header("Authorization", "Bearer " + l.token())
                    .header("Idempotency-Key", UUID.randomUUID().toString()),
                compra(1, "4000000000000002")))
        .andExpect(status().isPaymentRequired());
    assertThat(jdbc.queryForObject("select count(*) from pedidos", Integer.class)).isZero();
    assertThat(jdbc.queryForObject("select stock from productos where id=3", Integer.class))
        .isEqualTo(25);
  }

  @Test
  void stockInsuficienteRevierteLaCompra() throws Exception {
    Login l = cliente();
    mvc.perform(
            content(
                post("/api/pedidos")
                    .header("Authorization", "Bearer " + l.token())
                    .header("Idempotency-Key", UUID.randomUUID().toString()),
                compra(26, "4242424242424242")))
        .andExpect(status().isConflict());
    assertThat(jdbc.queryForObject("select count(*) from pedidos", Integer.class)).isZero();
  }

  @Test
  void compraRequiereDireccionYCantidadesEnteras() throws Exception {
    Login l = cliente();
    for (String d :
        List.of(
            compra(1, "4242424242424242").replace("Calle 123", ""), compra(0, "4242424242424242")))
      mvc.perform(
              content(
                  post("/api/pedidos")
                      .header("Authorization", "Bearer " + l.token())
                      .header("Idempotency-Key", UUID.randomUUID().toString()),
                  d))
          .andExpect(status().isBadRequest());
  }

  @Test
  void repetirConfirmacionEsIdempotente() throws Exception {
    Login l = cliente();
    String key = UUID.randomUUID().toString();
    long a = body(comprar(l, key, 1)).path("id").asLong(),
        b = body(comprar(l, key, 1)).path("id").asLong();
    assertThat(a).isEqualTo(b);
    assertThat(jdbc.queryForObject("select count(*) from pedidos", Integer.class)).isEqualTo(1);
    assertThat(jdbc.queryForObject("select stock from productos where id=3", Integer.class))
        .isEqualTo(24);
    mvc.perform(
            content(
                post("/api/pedidos")
                    .header("Authorization", "Bearer " + l.token())
                    .header("Idempotency-Key", key),
                compra(2, "4242424242424242")))
        .andExpect(status().isConflict());
  }

  @Test
  void clienteNoVePedidosDeOtroCliente() throws Exception {
    long id = body(comprar(admin(), UUID.randomUUID().toString(), 1)).path("id").asLong();
    Login l = cliente();
    mvc.perform(get("/api/pedidos/" + id).header("Authorization", "Bearer " + l.token()))
        .andExpect(status().isForbidden());
    mvc.perform(get("/api/pedidos").header("Authorization", "Bearer " + l.token()))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.length()").value(0));
  }

  @Test
  void cancelarReponeUnaSolaVezYBloqueaCambios() throws Exception {
    Login l = admin();
    long id = body(comprar(l, UUID.randomUUID().toString(), 1)).path("id").asLong();
    for (int i = 0; i < 2; i++)
      mvc.perform(
              content(
                  patch("/api/pedidos/" + id + "/estado")
                      .header("Authorization", "Bearer " + l.token()),
                  "{\"estado\":\"cancelado\"}"))
          .andExpect(status().isOk());
    assertThat(jdbc.queryForObject("select stock from productos where id=3", Integer.class))
        .isEqualTo(25);
    mvc.perform(
            content(
                patch("/api/pedidos/" + id + "/estado")
                    .header("Authorization", "Bearer " + l.token()),
                "{\"estado\":\"pagado\"}"))
        .andExpect(status().isConflict());
    mvc.perform(
            delete("/api/pedidos/" + id)
                .cookie(csrfCookie)
                .header("X-XSRF-TOKEN", csrfToken)
                .header("Authorization", "Bearer " + l.token()))
        .andExpect(status().isNoContent());
  }

  @Test
  void clienteNoPuedeCambiarEstado() throws Exception {
    Login l = cliente();
    long id = body(comprar(l, UUID.randomUUID().toString(), 1)).path("id").asLong();
    mvc.perform(
            content(
                patch("/api/pedidos/" + id + "/estado")
                    .header("Authorization", "Bearer " + l.token()),
                "{\"estado\":\"entregado\"}"))
        .andExpect(status().isForbidden());
  }

  @Test
  void concurrenciaNoSobrevendeLaUltimaUnidad() throws Exception {
    jdbc.update("update productos set stock=1 where id=3");
    var request = json.readValue(compra(1, "4242424242424242"), ApiDtos.CompraRequest.class);
    CountDownLatch start = new CountDownLatch(1);
    try (ExecutorService executor = Executors.newFixedThreadPool(2)) {
      Callable<Boolean> task =
          () -> {
            start.await();
            try {
              pedidosService.comprar(2L, UUID.randomUUID().toString(), request);
              return true;
            } catch (ApiException e) {
              assertThat(e.status.value()).isEqualTo(409);
              return false;
            }
          };
      Future<Boolean> a = executor.submit(task), b = executor.submit(task);
      start.countDown();
      assertThat(List.of(a.get(15, TimeUnit.SECONDS), b.get(15, TimeUnit.SECONDS)))
          .containsExactlyInAnyOrder(true, false);
    }
    assertThat(jdbc.queryForObject("select stock from productos where id=3", Integer.class))
        .isZero();
    assertThat(jdbc.queryForObject("select count(*) from pedidos", Integer.class)).isEqualTo(1);
  }

  @Test
  void cantidadFraccionariaNoSeRedondea() throws Exception {
    Login l = cliente();
    String data = compra(1, "4242424242424242").replace("\"cantidad\":1", "\"cantidad\":1.5");
    mvc.perform(
            content(
                post("/api/pedidos")
                    .header("Authorization", "Bearer " + l.token())
                    .header("Idempotency-Key", UUID.randomUUID().toString()),
                data))
        .andExpect(status().isBadRequest());
    assertThat(jdbc.queryForObject("select count(*) from pedidos", Integer.class)).isZero();
  }

  String usuario(String email, String rol) {
    return "{\"nombre\":\"Usuario REST\",\"email\":\""
        + email
        + "\",\"rol\":\""
        + rol
        + "\",\"password\":\"Password123!\"}";
  }

  @Test
  void crudUsuarioRetiraCuentaYSesiones() throws Exception {
    Login a = admin();
    MvcResult created =
        mvc.perform(
                content(
                    post("/api/usuarios").header("Authorization", "Bearer " + a.token()),
                    usuario("rest@example.com", "cliente")))
            .andExpect(status().isCreated())
            .andReturn();
    long id = body(created).path("id").asLong();
    Login u = login("rest@example.com", "Password123!");
    mvc.perform(
            content(
                put("/api/usuarios/" + id).header("Authorization", "Bearer " + a.token()),
                usuario("rest@example.com", "cliente").replace("Usuario REST", "Nombre editado")))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.nombre").value("Nombre editado"));
    mvc.perform(get("/api/auth/me").header("Authorization", "Bearer " + u.token()))
        .andExpect(status().isUnauthorized());
    u = login("rest@example.com", "Password123!");
    mvc.perform(
            delete("/api/usuarios/" + id)
                .cookie(csrfCookie)
                .header("X-XSRF-TOKEN", csrfToken)
                .header("Authorization", "Bearer " + a.token()))
        .andExpect(status().isNoContent());
    mvc.perform(get("/api/auth/me").header("Authorization", "Bearer " + u.token()))
        .andExpect(status().isUnauthorized());
    mvc.perform(
            content(
                post("/api/auth/login"),
                "{\"email\":\"rest@example.com\",\"password\":\"Password123!\"}"))
        .andExpect(status().isUnauthorized());
    mvc.perform(get("/api/usuarios/" + id).header("Authorization", "Bearer " + a.token()))
        .andExpect(status().isNotFound());
  }

  @Test
  void cambioDeRolRevocaJwtAnterior() throws Exception {
    Login a = admin();
    MvcResult created =
        mvc.perform(
                content(
                    post("/api/usuarios").header("Authorization", "Bearer " + a.token()),
                    usuario("rol@example.com", "vendedor")))
            .andExpect(status().isCreated())
            .andReturn();
    long id = body(created).path("id").asLong();
    Login u = login("rol@example.com", "Password123!");
    mvc.perform(
            content(
                put("/api/usuarios/" + id).header("Authorization", "Bearer " + a.token()),
                usuario("rol@example.com", "cliente").replace("Password123!", "")))
        .andExpect(status().isOk());
    mvc.perform(get("/api/auth/me").header("Authorization", "Bearer " + u.token()))
        .andExpect(status().isUnauthorized());
    Login nuevo = login("rol@example.com", "Password123!");
    mvc.perform(
            content(
                post("/api/productos").header("Authorization", "Bearer " + nuevo.token()),
                producto()))
        .andExpect(status().isForbidden());
  }

  @Test
  void corsNoAutorizaOrigenAjeno() throws Exception {
    mvc.perform(
            options("/api/usuarios")
                .header("Origin", "https://ajeno.example")
                .header("Access-Control-Request-Method", "GET"))
        .andExpect(status().isForbidden());
    mvc.perform(
            options("/api/productos")
                .header("Origin", "http://127.0.0.1:5173")
                .header("Access-Control-Request-Method", "GET"))
        .andExpect(status().isOk())
        .andExpect(header().string("Access-Control-Allow-Origin", "http://127.0.0.1:5173"));
  }

  @Test
  void pedidoManualCreaConPreciosDeServidor() throws Exception {
    Login a = admin();
    String data =
        "{\"items\":[{\"id\":3,\"cantidad\":1}],\"entrega\":{\"nombre\":\"Cliente\",\"email\":\"cliente@duoc.cl\",\"telefono\":\"912345678\",\"tipoEntrega\":\"presencial\"},\"usuario\":\"cliente@duoc.cl\",\"metodoPago\":\"efectivo\"}";
    mvc.perform(
            content(
                post("/api/admin/pedidos")
                    .header("Authorization", "Bearer " + a.token())
                    .header("Idempotency-Key", UUID.randomUUID().toString()),
                data))
        .andExpect(status().isCreated())
        .andExpect(jsonPath("$.total").value(49990))
        .andExpect(jsonPath("$.usuario").value("cliente@duoc.cl"));
  }

  @Test
  void contactoPersisteYSoloAdminPuedeListarlo() throws Exception {
    mvc.perform(
            content(
                post("/api/consultas"),
                "{\"nombre\":\"Demo\",\"email\":\"demo@example.com\",\"asunto\":\"Compra\",\"comentario\":\"Tengo"
                    + " una consulta\"}"))
        .andExpect(status().isCreated());
    assertThat(jdbc.queryForObject("select count(*) from consultas", Integer.class)).isEqualTo(1);
    mvc.perform(get("/api/consultas").header("Authorization", "Bearer " + cliente().token()))
        .andExpect(status().isForbidden());
    mvc.perform(get("/api/consultas").header("Authorization", "Bearer " + admin().token()))
        .andExpect(status().isOk());
  }
}
