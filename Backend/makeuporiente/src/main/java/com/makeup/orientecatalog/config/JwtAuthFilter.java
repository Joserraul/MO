package com.makeup.orientecatalog.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

/**
 * Filtro de autenticación JWT.
 *
 * ¿Qué hace? En cada petición HTTP:
 * 1. Mira el header "Authorization: Bearer eyJ..."
 * 2. Extrae el token y lo valida con JwtUtil
 * 3. Si es válido → extrae el email y rol → los pone en el SecurityContext
 * 4. Si no hay token o es inválido → la petición sigue sin autenticación
 *    (y SecurityConfig decide si la deja pasar o la rechaza)
 *
 * Esto es lo que permite que endpoints como GET /api/orders rechacen
 * a quien no tenga token válido (devuelve 401).
 */
@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;

    public JwtAuthFilter(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        String header = request.getHeader("Authorization");

        if (header != null && header.startsWith("Bearer ")) {
            String token = header.substring(7);

            if (jwtUtil.isValid(token)) {
                String email = jwtUtil.extractEmail(token);
                String role = jwtUtil.extractRole(token);

                // Spring Security espera roles en mayúsculas (ROLE_ADMIN).
                // En la BD pueden estar en minúscula ("admin"), así que normalizamos.
                String authority = role == null
                        ? "ROLE_USER"
                        : "ROLE_" + role.toUpperCase();

                // Le dice a Spring Security que este request es de "email" con ese rol
                UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                        email,
                        null,
                        List.of(new SimpleGrantedAuthority(authority))
                );

                SecurityContextHolder.getContext().setAuthentication(auth);
            }
        }

        // Siempre continúa la cadena (SecurityConfig decide si rechaza)
        filterChain.doFilter(request, response);
    }
}