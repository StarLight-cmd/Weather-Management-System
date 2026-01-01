package com.example.backend.user;

import com.example.backend.subscription.Subscription;
import jakarta.persistence.*;
import java.util.List;
import java.util.ArrayList;

// Mapping user class to database using JPA
@Entity
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String email;
    private String password;

    @Column(nullable = false)
    private boolean admin = false; // default value

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Subscription> subscriptions = new ArrayList<>();

    // Properties
    public Long getId(){return id;}

    public String getEmail(){
        return email;
    }

    public void setEmail(String email){
        this.email = email;
    }

    public String getPassword(){
        return password;
    }

    public void setPassword(String password){
        this.password = password;
    }

    public boolean isAdmin() { return admin; }

    public void setAdmin(boolean admin) { this.admin = admin; }

    @Override
    public String toString() {
        return "User{id=" + id + ", email='" + email + "'}";
    }

    public void setId(long l) {
        this.id = l;
    }
}
