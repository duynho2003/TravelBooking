package com.example.city_tours.dto.request.Tour;

import com.example.city_tours.dto.request.TourLocation.CreateTourLocationRequestDto;
import com.example.city_tours.dto.request.TourTime.CreateTourTimeRequestDto;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Set;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class CreateTourRequestDto {

    private String code;
    private String name;
    private String description;
    private String detail;
    private Double price;
    private Double discount;
    private String locations;
    private String depart;
    private String startTime;
    private int adults;
    private int children;
    private int baby;
    private String thumbnail;
    private Set<CreateTourTimeRequestDto> tourTimes;
    private Set<CreateTourLocationRequestDto> tourLocations;

}