package com.example.city_tours.dto.request.Hotel;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class UpdateHotelImagesRequestDto {

    private Long hotelId;
    private String imageUrl;

}