package com.example.city_tours.dto.request.Auth;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Set;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class RegisterRequestDto {
    private String username;

    private String email;

    private String password;

    private Set<String> roles;
}
