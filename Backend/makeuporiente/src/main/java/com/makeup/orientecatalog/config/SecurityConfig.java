package com.makeup.orientecatalog.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * Corazón de la seguridad: define qué endpoints son públicos y cuáles
 * requieren autenticación o rol de administrador.
 *
 * Regla de oro: por defecto TODO está protegido; solo los pocos endpoints
 * listados como "permitAll" son accesibles sin login (registro, login,
 * ver catálogo y WebSocket).
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;

    /**
     * Orígenes permitidos por CORS (los lee de application.properties).
     * Agrega aquí la IP de tu celular si accedes desde la red local.
     */
    private final List<String> allowedOrigins;

    public SecurityConfig(
            JwtAuthFilter jwtAuthFilter,
            @Value("${cors.allowed-origins}") String origins) {
        this.jwtAuthFilter = jwtAuthFilter;
        this.allowedOrigins = Arrays.stream(origins.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .toList();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth

                // ----- PÚBLICOS (sin token) -----
                // Registro de usuario y login
                .requestMatchers(HttpMethod.POST, "/api/users").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/users/login").permitAll()
                // Ver catálogo (cualquiera puede navegar productos)
                .requestMatchers(HttpMethod.GET, "/api/products/**").permitAll()
                // WebSocket (stock en tiempo real)
                .requestMatchers("/ws/**").permitAll()

                // ----- SOLO ADMIN -----
                // Ver TODOS los pedidos (datos de clientes)
                .requestMatchers("/api/orders").hasRole("ADMIN")
                // Crear / modificar productos
                .requestMatchers(HttpMethod.POST, "/api/products").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/products/**").hasRole("ADMIN")
                // Listar usuarios
                .requestMatchers(HttpMethod.GET, "/api/users").hasRole("ADMIN")

                // ----- CUALQUIER USUARIO LOGEADO -----
                // Cualquier otra cosa requiere token válido
                .anyRequest().authenticated()
            )
            // Registra el filtro JWT ANTES del filtro de autenticación por defecto
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    /**
     * Codificador BCrypt: se usa para hashear contraseñas.
     * BCrypt es un hash con "sal" (aleatorio) que lo hace imposible de
     * revertir: ni el admin ni quien lea la BD puede ver la contraseña real.
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * CORS restringido: solo se permite el origen del frontend
     * (localhost en desarrollo) + los equipos de tu red local
     * (192.168.x / 10.x) para probar desde el celular.
     *
     * Los patrones con "*" NO abren la puerta a internet: solo aceptan
     * origenes locales o de tu LAN.
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();

        List<String> patterns = new ArrayList<>(allowedOrigins);
        // Frontend en el mismo equipo (cualquier puerto de dev)
        patterns.add("http://localhost:*");
        patterns.add("http://127.0.0.1:*");
        // Dispositivos en la red local (celular, tablet, otra PC)
        patterns.add("http://192.168.*:*");
        patterns.add("http://10.*:*");

        config.setAllowedOriginPatterns(patterns);
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}