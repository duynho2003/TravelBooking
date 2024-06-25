package com.example.city_tours.dto.request.User;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Set;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class CreateAccountRequestDto {
    private String username;

    private String email;

    private String password;

    private Set<String> roles;
}
