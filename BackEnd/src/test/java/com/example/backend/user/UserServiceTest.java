package com.example.backend.user;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    private User user;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        user = new User();
        user.setId(1L);
        user.setEmail("sash@gmail.com");
        user.setPassword("secret");
        user.setAdmin(false);
    }

    // findByEmail Tests
    @Test
    void findByEmail_UserNotFound_ReturnsEmptyOptional() {
        when(userRepository.findByEmail("sash@gmail.com")).thenReturn(Optional.empty());

        Optional<User> result = userService.findByEmail("sash@gmail.com");

        assertTrue(result.isEmpty());
        verify(userRepository, times(1)).findByEmail("sash@gmail.com");
    }

    @Test
    void findByEmail_UserFound_ReturnsUser() {
        when(userRepository.findByEmail("sash@gmail.com")).thenReturn(Optional.of(user));

        Optional<User> result = userService.findByEmail("sash@gmail.com");

        assertTrue(result.isPresent());
        assertEquals("sash@gmail.com", result.get().getEmail());
    }

    // saveUser Tests
    @Test
    void saveUser_Success_ReturnsSavedUser() {
        when(userRepository.save(user)).thenReturn(user);

        User saved = userService.saveUser(user);

        assertEquals("sash@gmail.com", saved.getEmail());
        verify(userRepository, times(1)).save(user);
    }

    // checkPassword Tests
    @Test
    void checkPassword_MatchingPasswords_ReturnsTrue() {
        assertTrue(userService.checkPassword(user, "secret"));
    }

    @Test
    void checkPassword_WrongPassword_ReturnsFalse() {
        assertFalse(userService.checkPassword(user, "wrong"));
    }

    // isUserAdmin Tests
    @Test
    void isUserAdmin_UserNotFound_ReturnsFalse() {
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        assertFalse(userService.isUserAdmin(1L));
    }

    @Test
    void isUserAdmin_UserFound_ReturnsTrueIfAdmin() {
        user.setAdmin(true);
        when(userRepository.findById(2L)).thenReturn(Optional.of(user));

        assertTrue(userService.isUserAdmin(2L));
    }

    @Test
    void isUserAdmin_UserFound_ReturnsFalseIfNotAdmin() {
        user.setAdmin(false);
        when(userRepository.findById(3L)).thenReturn(Optional.of(user));

        assertFalse(userService.isUserAdmin(3L));
    }
}
