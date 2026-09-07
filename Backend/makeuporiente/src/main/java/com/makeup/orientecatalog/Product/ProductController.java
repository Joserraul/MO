package com.makeup.orientecatalog.Product;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")

public class ProductController {

    private final ProductService service;


    @Autowired
    public ProductController(ProductService service) {
        this.service = service;
    }

    @GetMapping
    public List<Product> listar() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public Product obtenerPorId(@PathVariable Long id) {
        return service.findById(id)
                .orElseThrow(() -> new RuntimeException("No existe el producto con el id: " + id));
    }

    @PostMapping
    public Product crear(@RequestBody Product product) {
        return service.create(product);
    }

    @PutMapping("/{id}")
    public Product actualizar(@PathVariable Long id, @RequestBody Product productDetails) {
        return service.update(id, productDetails);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {
        service.delete(id);
    }

}

