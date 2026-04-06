package com.campuseventhub.backend.controller;

import com.campuseventhub.backend.model.User;
import com.campuseventhub.backend.repository.UserRepository;
import com.campuseventhub.backend.dto.AuthRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepo;

    // ✅ REGISTER
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {

        // normalize input
        String email = user.getEmail().trim().toLowerCase();
        String password = user.getPassword().trim();

        // check duplicate user
        if (userRepo.findByEmail(email).isPresent()) {
            return ResponseEntity.status(400).body("User already exists");
        }

        user.setEmail(email);
        user.setPassword(password);

        if (user.getRole() == null || user.getRole().isEmpty()) {
            user.setRole("USER");
        }

        User savedUser = userRepo.save(user);
        return ResponseEntity.ok(savedUser);
    }

    // ✅ LOGIN
@PostMapping("/login")
public ResponseEntity<?> login(@RequestBody User loginUser) {

    String email = loginUser.getEmail().trim().toLowerCase(); // 🔥 ADD THIS
    String password = loginUser.getPassword().trim();

    User user = userRepo.findByEmail(email).orElse(null);

    if (user == null) {
        return ResponseEntity.status(400).body("User not found");
    }

    if (!user.getPassword().equals(password)) {
        return ResponseEntity.status(400).body("Invalid password");
    }

    return ResponseEntity.ok(user);
}

    // ✅ GET ALL USERS
    @GetMapping("/users")
    public List<User> getAllUsers() {
        return userRepo.findAll();
    }

    // ✅ DELETE ALL USERS (for testing)
    @DeleteMapping("/users")
    public String deleteAllUsers() {
        userRepo.deleteAll();
        return "All users deleted";
    }

    // ✅ DELETE SINGLE USER (optional)
    @DeleteMapping("/users/{id}")
    public String deleteUser(@PathVariable Long id) {
        userRepo.deleteById(id);
        return "User deleted";
    }
}