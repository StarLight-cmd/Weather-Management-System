package com.example.backend;

import com.example.backend.user.User;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class UserTest {



    @Test
    void getEmail() {
        User user = new User();
        user.setEmail("sashen@gmail.com");
        assertNotEquals("sash@gmail.com",user.getEmail());
    }

   /* @Test
    void setEmail() {
    }

    @Test
    void getPassword() {
    }

    @Test
    void setPassword() {
    }

    @Test
    void isAdmin() {
    }

    @Test
    void setAdmin() {
    }

    @Test
    void testToString() {
    } */
}