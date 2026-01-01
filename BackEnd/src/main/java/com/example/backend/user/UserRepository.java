package com.example.backend.user;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    // using spring data JPA to automatically generate logic
    // For my WMS DB operations
    boolean existsByEmail(String email);
    Optional<User> findByEmail(String email);
}

