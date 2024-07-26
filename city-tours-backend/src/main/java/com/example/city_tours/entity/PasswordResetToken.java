package com.example.city_tours.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@AllArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "password_reset_tokens")
public class PasswordResetToken {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String token;

    private LocalDateTime expiresAt;

    @ManyToOne
    @JoinColumn(nullable = false, name = "user_id")
    private User user;

    public PasswordResetToken(User user) {
        this.token = generateToken(); // Implement token generation
        this.expiresAt = LocalDateTime.now().plusHours(1); // Set token expiry time
        this.user = user;
    }

    public PasswordResetToken() {

    }

    private String generateToken() {
        // Implement token generation logic
        return java.util.UUID.randomUUID().toString();
    }
}
