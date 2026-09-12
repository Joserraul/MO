package com.makeup.orientecatalog.order;

import com.makeup.orientecatalog.Product.Product;
import com.makeup.orientecatalog.Product.ProductRepository;
import com.makeup.orientecatalog.user.User;
import com.makeup.orientecatalog.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    public OrderService(OrderRepository orderRepository, UserRepository userRepository, ProductRepository productRepository) {
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
    }

    public Order create(Long userId, Order order) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        order.setUser(user);
        order.setOrderDate(LocalDateTime.now());

        for (OrderItem item : order.getItems()) {
            item.setOrder(order);
            restarStock(item.getProductId(), item.getQuantity());
        }

        return orderRepository.save(order);
    }

    private void restarStock(Long productId, int quantity) {
        productRepository.findById(productId).ifPresent(product -> {
            int nuevoStock = Math.max(0, product.getStock() - quantity);
            product.setStock(nuevoStock);
            productRepository.save(product);
            messagingTemplate.convertAndSend("/topic/stock",
                    String.format("{\"id\":%d, \"stock\":%d}", product.getId(), nuevoStock));
        });
    }

    public List<Order> findByUserId(Long userId) {
        return orderRepository.findByUserId(userId);
    }

    public Order findById(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pedido no encontrado"));
    }
}