package com.makeup.orientecatalog.user;

import com.makeup.orientecatalog.config.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Autowired
    public UserService(UserRepository repository,
                       PasswordEncoder passwordEncoder,
                       JwtUtil jwtUtil) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    /**
     * Crea un usuario guardando la contraseña HASHEAD con BCrypt.
     * Nunca se guarda la contraseña en texto plano.
     */
    public User create(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        // Todo usuario nuevo es "USER" a menos que el admin indique otro rol
        if (user.getRole() == null || user.getRole().isEmpty()) {
            user.setRole("USER");
        }
        return repository.save(user);
    }

    public List<User> findAll() {
        return repository.findAll();
    }

    public Optional<User> findById(Long id) {
        return repository.findById(id);
    }

    /**
     * Actualiza un usuario. Solo re-hashea la contraseña si viene una nueva
     * (así no se corrompe la existente con un string vacío del form).
     */
    public User update(Long id, User userDetails) {
        return repository.findById(id)
                .map(user -> {
                    user.setUsername(userDetails.getUsername());
                    user.setLastName(userDetails.getLastName());
                    user.setPhone(userDetails.getPhone());
                    user.setEmail(userDetails.getEmail());
                    if (userDetails.getPassword() != null && !userDetails.getPassword().isEmpty()) {
                        user.setPassword(passwordEncoder.encode(userDetails.getPassword()));
                    }
                    user.setRole(userDetails.getRole());
                    return repository.save(user);
                })
                .orElseGet(() -> {
                    userDetails.setId(id);
                    userDetails.setPassword(passwordEncoder.encode(userDetails.getPassword()));
                    return repository.save(userDetails);
                });
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }

    /**
     * Login seguro:
     * 1. Busca el usuario por email
     * 2. Verifica la contraseña con BCrypt (matches = el hash coincide)
     * 3. Si es válida, genera y devuelve el JWT junto con el usuario
     */
    public LoginResponse login(String email, String password) {
        User user = repository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Credenciales incorrectas"));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Credenciales incorrectas");
        }

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole());
        return new LoginResponse(token, user);
    }
}