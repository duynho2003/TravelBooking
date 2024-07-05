package com.example.city_tours.dto.response.Region;

import com.example.city_tours.dto.request.Province.CreateProvinceRequestDto;
import com.example.city_tours.dto.response.Province.CreateProvinceResponseDto;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Set;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class CreateRegionResponseDto {

    private Long id;
    private String name;
    private Set<CreateProvinceResponseDto> provinces;

}
