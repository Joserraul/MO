package com.makeup.orientecatalog.Product;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductService {

    private final ProductRepository repository;

    @Autowired
    public ProductService(ProductRepository repository) {
        this.repository = repository;
    }

    public Product create(Product product) {
        return repository.save(product);
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
                    return repository.save(existingProduct);
                })
                .orElseThrow(() -> new RuntimeException("Product not found with id " + id));

    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
}
