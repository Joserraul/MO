package com.makeup.orientecatalog.Product;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import java.util.List;
import java.util.Optional;

@Service
public class ProductService {

    private final ProductRepository repository;

    // Parte dos: Inyección del template para enviar mensajes
    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    public ProductService(ProductRepository repository) {
        this.repository = repository;
    }

    public Product create(Product product) {
        Product savedProduct = repository.save(product);


        String mensaje = "{\"id\":" + savedProduct.getId() + ", \"stock\":" + savedProduct.getStock() + "}";
        messagingTemplate.convertAndSend("/topic/stock", mensaje);

        return savedProduct;
    }

    public List<Product> findAll() {
        return repository.findAll();
    }

    public Optional<Product> findById(Long id) {
        return repository.findById(id);
    }

    public Product update(Long id, Product productDetails) {
        return repository.findById(id)
                .map(existingProduct -> {
                    existingProduct.setName(productDetails.getName());
                    existingProduct.setBrand(productDetails.getBrand());
                    existingProduct.setCategory(productDetails.getCategory());
                    existingProduct.setDescription(productDetails.getDescription());
                    existingProduct.setPrice(productDetails.getPrice());
                    existingProduct.setStock(productDetails.getStock());
                    Product savedProduct = repository.save(existingProduct);

                    String mensaje = String.format("{\"id\":" + savedProduct.getId() + ", \"stock\":" + savedProduct.getStock() + "}");
                    messagingTemplate.convertAndSend("/topic/stock", mensaje);

                    return savedProduct;
                })
                .orElseThrow(() -> new RuntimeException("Product not found with id " + id));
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
}