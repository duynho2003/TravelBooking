package com.example.city_tours.dto.request.Region;

import com.example.city_tours.dto.request.Province.CreateProvinceRequestDto;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Set;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class UpdateRegionRequestDto {

    private String name;
    private Set<CreateProvinceRequestDto> provinces;

}
