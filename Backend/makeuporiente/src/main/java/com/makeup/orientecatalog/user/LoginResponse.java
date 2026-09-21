package com.makeup.orientecatalog.user;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * Respuesta del login: el token JWT que el frontend debe guardar
 * y el usuario autenticado (sin contraseña, gracias a WRITE_ONLY en User).
 */
public class LoginResponse {

    private String token;
    private User user;

    public LoginResponse(String token, User user) {
        this.token = token;
        this.user = user;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    @JsonProperty("user")
    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}