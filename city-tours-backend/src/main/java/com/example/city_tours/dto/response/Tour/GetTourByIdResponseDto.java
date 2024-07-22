package com.example.city_tours.dto.response.Tour;

import com.example.city_tours.dto.response.TourLocation.GetATourLocationResponseDto;
import com.example.city_tours.dto.response.TourTime.GetATourTimeResponseDto;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class GetTourByIdResponseDto {

    private Long id;
    private String name;
    private String description;
    private String detail;
    private Double rating;
    private int numberOfRating;
    private Double priceAdult;
    private Double priceChild;
    private Double priceBaby;
    private Double discount;
    private String depart;
    private String code;
    private int adults;
    private int children;
    private int baby;
    private String thumbnail;
    private String startTime;
    private String bookedStatus;
    private String activeStatus;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<GetATourTimeResponseDto> tourTimes;
    private List<GetATourLocationResponseDto> tourLocations;

}