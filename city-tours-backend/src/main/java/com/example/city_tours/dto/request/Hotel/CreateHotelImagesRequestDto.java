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
public class CreateHotelImagesRequestDto {

    private Long hotelId;
    private String imageUrl;

}