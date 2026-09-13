package com.makeup.orientecatalog.order;

import com.makeup.orientecatalog.user.User;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public class OrderSummary {

    private Long id;
    private String clientName;
    private String clientPhone;
    private LocalDateTime orderDate;
    private LocalDate paymentDate;
    private String paymentMethod;
    private String deliveryMethod;
    private String transferNumber;
    private List<OrderItem> items;

    public OrderSummary(Order order) {
        this.id = order.getId();

        User user = order.getUser();
        String name = user.getUsername() + " " + (user.getLastName() != null ? user.getLastName() : "");
        this.clientName = name.trim();
        this.clientPhone = user.getPhone();

        this.orderDate = order.getOrderDate();
        this.paymentDate = order.getPaymentDate();
        this.paymentMethod = order.getPaymentMethod();
        this.deliveryMethod = order.getDeliveryMethod();
        this.transferNumber = order.getTransferNumber();
        this.items = order.getItems();
    }

    public Long getId() { return id; }
    public String getClientName() { return clientName; }
    public String getClientPhone() { return clientPhone; }
    public LocalDateTime getOrderDate() { return orderDate; }
    public LocalDate getPaymentDate() { return paymentDate; }
    public String getPaymentMethod() { return paymentMethod; }
    public String getDeliveryMethod() { return deliveryMethod; }
    public String getTransferNumber() { return transferNumber; }
    public List<OrderItem> getItems() { return items; }
}