package com.makeup.orientecatalog.user;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService service;

    @Autowired
    public UserController(UserService service) {
        this.service = service;
    }

    // CREATE: Crear un nuevo usuario
    @PostMapping
    public User crear(@RequestBody User user) {
        return service.create(user);
    }

    // READ all
    @GetMapping
    public List<User> listar() {
        return service.findAll();
    }

    // READ one
    @GetMapping("/{id}")
    public User obtenerPorId(@PathVariable Long id) {
        return service.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }

    // UPDATE
    @PutMapping("/{id}")
    public User actualizar(@PathVariable Long id, @RequestBody User userDetails) {
        return service.update(id, userDetails);
    }

    // DELETE
    @DeleteMapping("/{id}")
    public void borrar(@PathVariable Long id) {
        service.delete(id);
    }
}