package com.example.city_tours.dto.response.Website;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class UpdateInfoResponseDto {
    private Long id;

    private String name;

    private String logo;

    private String email;

    private String phone;

    private String address;

    private String workingDate;

    private LocalDateTime updatedAt;
}
