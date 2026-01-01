package com.example.backend.subscription;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SubscriptionRepository extends JpaRepository<Subscription, Long> {
    List<Subscription> findByUserId(Long userId);
    void deleteByUserIdAndLocation(Long userId, String location);
    boolean existsByUserIdAndLocation(Long userId, String location);
}