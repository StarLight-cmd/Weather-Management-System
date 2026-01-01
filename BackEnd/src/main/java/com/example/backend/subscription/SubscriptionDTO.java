package com.example.backend.subscription;

public class SubscriptionDTO {
    private Long id;
    private String location;
    private Long userId;

    public SubscriptionDTO() {}

    public SubscriptionDTO(Long id, String location, Long userId) {
        this.id = id;
        this.location = location;
        this.userId = userId;
    }

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
}
