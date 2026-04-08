package com.url.shorter.Controller;

import com.url.shorter.dtos.LoginRequest;
import com.url.shorter.dtos.RegisterRequest;
import com.url.shorter.models.User;
import com.url.shorter.repository.UserRepository;
import com.url.shorter.services.UserService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@AllArgsConstructor
public class AuthController {

    private UserService userService;
    private UserRepository userRepository;
    
    @PostMapping("/public/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest loginRequest)
    {
        try {
            return ResponseEntity.ok(userService.authenticateUser(loginRequest));
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Login failed: " + e.getMessage());
        }
    }
    @PostMapping("/public/register")
    public ResponseEntity<?> registerUser(@RequestBody RegisterRequest registerRequest)
    {
        if (userRepository.findByUsername(registerRequest.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body("Error: Username is already taken!");
        }
        User user=new User();
user.setUsername(registerRequest.getUsername());
user.setPassword(registerRequest.getPassword());
user.setEmail(registerRequest.getEmail());
user.setRole("ROLE_USER");
userService.registerUser(user);
return ResponseEntity.ok("User registered successfully");
    }
}
