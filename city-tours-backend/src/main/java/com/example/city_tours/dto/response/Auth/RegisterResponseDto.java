package com.example.city_tours.dto.response.Auth;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.Set;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class RegisterResponseDto {
    private Long id;

    private String username;

    private String email;

    private Set<String> roles;

    private LocalDateTime createdAt;
}
