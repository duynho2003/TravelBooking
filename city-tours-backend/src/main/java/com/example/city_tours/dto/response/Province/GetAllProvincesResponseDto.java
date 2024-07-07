package com.example.city_tours.dto.response.Province;

import com.example.city_tours.dto.response.Hotel.GetHotelByIdResponseDto;
import com.example.city_tours.entity.Hotel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Set;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class GetAllProvincesResponseDto {

    private Long id;
    private String name;
    private String thumbnail;
    private int quantityHotels;
    private Set<GetHotelByIdResponseDto> hotels;

}
