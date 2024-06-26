package com.example.city_tours.dto.request.Website;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class UpdateInfoRequestDto {
    private String name;

    private MultipartFile logo;

    private String email;

    private String phone;

    private String address;

    private String workingDate;

    private String workingTime;
}
