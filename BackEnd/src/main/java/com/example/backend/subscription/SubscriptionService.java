package com.example.backend.subscription;

import com.example.backend.user.User;
import com.example.backend.user.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SubscriptionService {

    @Autowired
    private SubscriptionRepository subscriptionRepository;

    @Autowired
    private UserRepository userRepository;

    public Optional<Subscription> createSubscription(Subscription subscription) {
        Optional<User> user = userRepository.findById(subscription.getUser().getId());
        if (user.isEmpty()) {
            return Optional.empty();
        }
        subscription.setUser(user.get());
        Subscription saved = subscriptionRepository.save(subscription);
        return Optional.of(saved);
    }

    public Optional<List<Subscription>> getSubscriptionsByUserId(Long userId) {
        Optional<User> user = userRepository.findById(userId);
        if (user.isEmpty()) {
            return Optional.empty();
        }
        return Optional.of(subscriptionRepository.findByUserId(userId));
    }

    @Transactional
    public boolean deleteSubscription(Long userId, String location) {
        if (!subscriptionRepository.existsByUserIdAndLocation(userId, location)) {
            return false;
        }
        subscriptionRepository.deleteByUserIdAndLocation(userId, location);
        return true;
    }
}
