package com.example.city_tours.dto.request.Hotel;

import com.example.city_tours.entity.Schedule;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Set;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class CreateHotelRequestDto {

    private String name;
    private String description;
    private String address;
    private Set<String> thumbnailUrls;

}