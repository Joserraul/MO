package com.makeup.orientecatalog.cart;

import jakarta.persistence.*;
import com.makeup.orientecatalog.user.User; // <--- Importa la clase User
import java.util.ArrayList;
import java.util.List;

@Entity
public class Cart {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String productName;
    private int quantity;

    // --- NUEVO: Relación ManyToOne hacia User ---
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;
    // -------------------------------------------

    public Cart() {}

    public Cart(String productName, int quantity) {
        this.productName = productName;
        this.quantity = quantity;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }

    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }

    // Getter y setter para user (opcional, pero bueno tenerlo)
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
}