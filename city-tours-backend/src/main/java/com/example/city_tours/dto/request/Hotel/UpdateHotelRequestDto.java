package com.example.city_tours.dto.request.Hotel;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Set;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class UpdateHotelRequestDto {

    private String name;
    private String description;
    private String address;
    private String activeStatus;
    private Set<String> thumbnailUrls;

}