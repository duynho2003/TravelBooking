package com.example.city_tours.dto.request.TourLocation;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class UpdateTourLocationRequestDto {

    private Long id;
    private String startPoint;
    private String endPoint;
    private String coordinatesStartPoint;
    private String coordinatesEndPoint;

}