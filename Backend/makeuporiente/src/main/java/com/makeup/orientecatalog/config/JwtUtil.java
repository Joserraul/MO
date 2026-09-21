package com.makeup.orientecatalog.config;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

/**
 * Utilidad para generar, validar y extraer datos de tokens JWT.
 *
 * ¿Qué hace? Cuando un usuario hace login, el servidor genera un token
 * firmado con una clave secreta. Ese token contiene el email y el rol.
 * El frontend lo guarda y lo envía en cada petición.
 * El servidor verifica la firma (no puede ser falsificado sin la clave).
 */
@Component
public class JwtUtil {

    private final SecretKey key;
    private final long expiration;

    public JwtUtil(
            @Value("${jwt.secret}") String secret,
            @Value("${jwt.expiration}") long expiration) {
        // La clave HMAC se genera a partir del string de application.properties
        this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.expiration = expiration;
    }

    /**
     * Genera un token JWT con el email y rol del usuario.
     * El token expira según la configuración (86400000ms = 24 horas).
     */
    public String generateToken(String email, String role) {
        return Jwts.builder()
                .subject(email)
                .claim("role", role)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(key)
                .compact();
    }

    /**
     * Extrae el email del token (el "subject").
     */
    public String extractEmail(String token) {
        return getClaims(token).getPayload().getSubject();
    }

    /**
     * Extrae el rol del token (claim personalizado).
     */
    public String extractRole(String token) {
        return getClaims(token).getPayload().get("role", String.class);
    }

    /**
     * Valida que el token sea auténtico (firma correcta) y no haya expirado.
     */
    public boolean isValid(String token) {
        try {
            getClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    private Jws<Claims> getClaims(String token) {
        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token);
    }
}