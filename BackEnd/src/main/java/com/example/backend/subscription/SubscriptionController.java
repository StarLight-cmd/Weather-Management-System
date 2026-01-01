package com.example.backend.subscription;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/subscriptions")
public class SubscriptionController {

    @Autowired
    private SubscriptionService subscriptionService;

    // Create subscription
    @PostMapping
    public ResponseEntity<SubscriptionDTO> createSubscription(@RequestBody SubscriptionDTO dto) {
        if (dto.getUserId() == null || dto.getLocation() == null || dto.getLocation().isBlank()) {
            return ResponseEntity.badRequest().build();
        }

        Subscription entity = mapToEntity(dto);

        Optional<Subscription> created = subscriptionService.createSubscription(entity);
        return created
                .map(sub -> ResponseEntity.ok(mapToDTO(sub)))
                .orElse(ResponseEntity.status(404).build());
    }

    // Get subscriptions by user ID
    @GetMapping("/{userId}")
    public ResponseEntity<List<SubscriptionDTO>> getSubscriptionsByUserId(@PathVariable Long userId) {
        if (userId == null) {
            return ResponseEntity.badRequest().build();
        }

        Optional<List<Subscription>> subs = subscriptionService.getSubscriptionsByUserId(userId);
        return subs
                .map(list -> ResponseEntity.ok(list.stream()
                        .map(this::mapToDTO)
                        .collect(Collectors.toList())))
                .orElse(ResponseEntity.status(404).build());
    }

    // Delete subscription
    @DeleteMapping
    public ResponseEntity<Void> deleteSubscription(@RequestParam Long userId, @RequestParam String location) {
        if (userId == null || location == null || location.isBlank()) {
            return ResponseEntity.badRequest().build();
        }

        boolean deleted = subscriptionService.deleteSubscription(userId, location);
        if (!deleted) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok().build();
    }

    // --- Mapping helpers ---
    private SubscriptionDTO mapToDTO(Subscription subscription) {
        return new SubscriptionDTO(
                subscription.getId(),
                subscription.getLocation(),
                subscription.getUser().getId()
        );
    }

    private Subscription mapToEntity(SubscriptionDTO dto) {
        Subscription subscription = new Subscription();
        subscription.setLocation(dto.getLocation());
        subscription.setUser(new com.example.backend.user.User()); // Only set ID for lookup
        subscription.getUser().setId(dto.getUserId());
        return subscription;
    }
}
