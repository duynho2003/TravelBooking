package com.example.city_tours.dto.request.User;

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
public class UpdateAccountRequestDto {

    private String username;
    private String email;
    private String password;
    private Set<String> roles;
    private String status;

}
