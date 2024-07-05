package com.example.city_tours.dto.response.Province;

import com.example.city_tours.dto.response.Hotel.GetHotelByIdResponseDto;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Set;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class GetProvinceByIdResponseDto {

    private Long id;
    private String name;
    private String thumbnail;
    private Set<GetHotelByIdResponseDto> hotels;

}
