package com.example.city_tours.dto.request.Tour;

import com.example.city_tours.dto.request.TourLocation.CreateTourLocationRequestDto;
import com.example.city_tours.dto.request.TourLocation.UpdateTourLocationRequestDto;
import com.example.city_tours.dto.request.TourTime.CreateTourTimeRequestDto;
import com.example.city_tours.dto.request.TourTime.UpdateTourTimeRequestDto;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Set;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class UpdateTourRequestDto {

    private String name;
    private String description;
    private String detail;
    private String depart;
    private Double price;
    private Double discount;
    private String locations;
    private int adults;
    private int children;
    private int baby;
    private String thumbnail;
    private String bookedStatus;
    private String activeStatus;
    private Set<UpdateTourTimeRequestDto> tourTimes;
    private Set<UpdateTourLocationRequestDto> tourLocations;

}