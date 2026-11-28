package cl.mitienda.dto.response;

public record AuthView(
    String accessToken, String tokenType, long expiresIn, UsuarioView usuario) {}
