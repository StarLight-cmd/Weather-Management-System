package com.example.backend.subscription;

import com.example.backend.user.User;
import com.example.backend.user.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class SubscriptionServiceTest {

    @Mock
    private SubscriptionRepository subscriptionRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private SubscriptionService subscriptionService;

    private User user;
    private Subscription subscription;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        user = new User();
        user.setId(1L);

        subscription = new Subscription();
        subscription.setId(1L);
        subscription.setLocation("Durban");
        subscription.setUser(user);
    }

    // Create subscription tests
    @Test
    void createSubscription_UserNotFound_ReturnsEmpty() {
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        Optional<Subscription> result = subscriptionService.createSubscription(subscription);

        assertTrue(result.isEmpty());
        verify(subscriptionRepository, never()).save(any());
    }

    @Test
    void createSubscription_Success_ReturnsEntity() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(subscriptionRepository.save(any(Subscription.class))).thenReturn(subscription);

        Optional<Subscription> result = subscriptionService.createSubscription(subscription);

        assertTrue(result.isPresent());
        assertEquals("Durban", result.get().getLocation());
        assertEquals(1L, result.get().getUser().getId());
    }

    // Get subscription tests
    @Test
    void getSubscriptionsByUserId_UserNotFound_ReturnsEmpty() {
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        Optional<List<Subscription>> result = subscriptionService.getSubscriptionsByUserId(1L);

        assertTrue(result.isEmpty());
        verify(subscriptionRepository, never()).findByUserId(anyLong());
    }

    @Test
    void getSubscriptionsByUserId_Success_ReturnsList() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(subscriptionRepository.findByUserId(1L)).thenReturn(Arrays.asList(subscription));

        Optional<List<Subscription>> result = subscriptionService.getSubscriptionsByUserId(1L);

        assertTrue(result.isPresent());
        assertEquals(1, result.get().size());
        assertEquals("Durban", result.get().get(0).getLocation());
    }

    // delete subscription tests
    @Test
    void deleteSubscription_NotExists_ReturnsFalse() {
        when(subscriptionRepository.existsByUserIdAndLocation(1L, "Durban")).thenReturn(false);

        boolean result = subscriptionService.deleteSubscription(1L, "Durban");

        assertFalse(result);
        verify(subscriptionRepository, never()).deleteByUserIdAndLocation(anyLong(), anyString());
    }

    @Test
    void deleteSubscription_Exists_ReturnsTrue() {
        when(subscriptionRepository.existsByUserIdAndLocation(1L, "Durban")).thenReturn(true);
        doNothing().when(subscriptionRepository).deleteByUserIdAndLocation(1L, "Durban");

        boolean result = subscriptionService.deleteSubscription(1L, "Durban");

        assertTrue(result);
        verify(subscriptionRepository, times(1)).deleteByUserIdAndLocation(1L, "Durban");
    }
}
