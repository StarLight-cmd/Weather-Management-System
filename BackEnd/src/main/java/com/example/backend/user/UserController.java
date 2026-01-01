package com.example.backend.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserService userService;

    // Login
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody UserDTO userDto) {
        // Validation
        if (userDto.getEmail() == null || userDto.getEmail().isBlank() ||
                userDto.getPassword() == null || userDto.getPassword().isBlank()) {
            return ResponseEntity.badRequest().body("Email and password are required");
        }

        Optional<User> userOpt = userService.findByEmail(userDto.getEmail());
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(404).body("User not found");
        }

        User user = userOpt.get();
        if (!userService.checkPassword(user, userDto.getPassword())) {
            return ResponseEntity.status(401).body("Invalid credentials");
        }

        return ResponseEntity.ok(mapToDTO(user, false));
    }

    // Register
    @PostMapping("/register")
    public ResponseEntity<UserDTO> register(@RequestBody UserDTO userDto) {
        if (userDto.getEmail() == null || userDto.getEmail().isBlank() ||
                userDto.getPassword() == null || userDto.getPassword().isBlank()) {
            return ResponseEntity.badRequest().build();
        }

        if (userService.findByEmail(userDto.getEmail()).isPresent()) {
            return ResponseEntity.status(400).build();
        }

        User savedUser = userService.saveUser(mapToEntity(userDto));
        return ResponseEntity.ok(mapToDTO(savedUser, false));
    }

    // Reset password
    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestBody UserDTO userDto) {
        if (userDto.getEmail() == null || userDto.getEmail().isBlank() ||
                userDto.getPassword() == null || userDto.getPassword().isBlank()) {
            return ResponseEntity.badRequest().body("Email and new password are required");
        }

        Optional<User> userOpt = userService.findByEmail(userDto.getEmail());
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(404).body("User not found");
        }

        User user = userOpt.get();
        user.setPassword(userDto.getPassword());
        userService.saveUser(user);

        return ResponseEntity.ok("Password reset successful!");
    }

    // Get user by email
    @GetMapping("/{email}")
    public ResponseEntity<UserDTO> getUser(@PathVariable String email) {
        Optional<User> userOpt = userService.findByEmail(email);
        return userOpt
                .map(user -> ResponseEntity.ok(mapToDTO(user, false)))
                .orElse(ResponseEntity.notFound().build());
    }

    // Check if admin
    @GetMapping("/is-admin/{id}")
    public ResponseEntity<Boolean> isAdmin(@PathVariable Long id) {
        Optional<User> userOpt = userService.findById(id);
        if (userOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(userOpt.get().isAdmin());
    }

    // Mapping helpers
    private UserDTO mapToDTO(User user, boolean includePassword) {
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setEmail(user.getEmail());
        dto.setAdmin(user.isAdmin());
        if (includePassword) {
            dto.setPassword(user.getPassword());
        }
        return dto;
    }

    private User mapToEntity(UserDTO dto) {
        User user = new User();
        user.setId(dto.getId());
        user.setEmail(dto.getEmail());
        user.setPassword(dto.getPassword());
        user.setAdmin(dto.isAdmin());
        return user;
    }
}
