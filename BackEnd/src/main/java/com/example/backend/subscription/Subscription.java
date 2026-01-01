package com.example.backend.subscription;

import com.example.backend.user.User;
import jakarta.persistence.*;

@Entity
public class Subscription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String location;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // properties
    public Long getId() { return id; }

    public String getLocation() { return location; }

    public void setLocation(String location) { this.location = location; }

    public User getUser() { return user; }

    public void setUser(User user) { this.user = user; }

    public void setId(long l) {
        this.id = l;
    }
}