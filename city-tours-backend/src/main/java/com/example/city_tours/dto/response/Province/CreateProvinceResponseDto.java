package com.example.city_tours.dto.response.Province;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class CreateProvinceResponseDto {

    private Long id;
    private String name;
    private String thumbnail;
    private long quantityHotel;

}
