package com.makeup.orientecatalog.order;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService service;

    @Autowired
    public OrderController(OrderService service) {
        this.service = service;
    }

    @PostMapping("/{userId}")
    public Order crear(@PathVariable Long userId, @RequestBody Order order) {
        return service.create(userId, order);
    }

    @GetMapping("/user/{userId}")
    public List<Order> pedidosDe(@PathVariable Long userId) {
        return service.findByUserId(userId);
    }


}