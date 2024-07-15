package com.example.city_tours.dto.response.TourLocation;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class GetATourLocationResponseDto {

    private Long id;
    private String startPoint;
    private String endPoint;
    private String coordinatesStartPoint;
    private String coordinatesEndPoint;

}