# Requisitos de la evaluación

La implementación y explicación de los doce indicadores de la pauta de noviembre están en [Backend_y_seguridad.md](Backend_y_seguridad.md) y su versión Word. Los requisitos funcionales y de calidad vigentes están en [ERS_v3.md](ERS_v3.md).

| Indicadores | Evidencia principal |
| --- | --- |
| IE3.1.1 e IE3.1.2 | Backend Spring Boot, modelos JPA, migración Flyway, base H2 persistente y descripción del modelo relacional |
| IE3.2.1 e IE3.2.3 | CRUD REST, DTO validados, respuestas HTTP y Swagger con OpenAPI |
| IE3.2.2 e IE3.2.4 | Cliente REST y contextos React, formularios integrados y cálculo de compra centralizado |
| IE3.3.1 e IE3.3.4 | BCrypt, JWT firmado, roles, control de propiedad de pedidos y revocación |
| IE3.3.2 e IE3.3.5 | Cookie HttpOnly, JWT en memoria, renovación, persistencia tras recarga y cierre seguro |
| IE3.3.3 e IE3.3.6 | Guardas de rutas, menú por rol, acciones restringidas y comprobación independiente en la API |

La evidencia ejecutada y sus límites se describen en [Cobertura_testing.md](Cobertura_testing.md). El perfil PostgreSQL está incluido como alternativa; la suite de integración se ejecuta con H2. La publicación real y la pasarela bancaria quedan fuera de esta entrega local.
