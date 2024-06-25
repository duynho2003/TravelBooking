package com.example.city_tours.dto.response.User;

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
public class GetAllAccountsResponseDto {

    private Long id;
    private String username;
    private String email;
    private Set<String> roles;
    private String status;
    private LocalDateTime createAt;
    private LocalDateTime updatedAt;
    
}
