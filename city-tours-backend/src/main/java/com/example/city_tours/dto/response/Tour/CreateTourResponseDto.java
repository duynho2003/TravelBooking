package com.example.city_tours.dto.response.Tour;

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
public class CreateTourResponseDto {

    private Long id;
    private String code;
    private String name;
    private String description;
    private Double price;
    private Double discount;
    private String locations;
    private String depart;
    private String startTime;
    private int adults;
    private int children;
    private int baby;
    private Double rating;
    private int numberOfRating;
    private String thumbnail;
    private String bookedStatus;
    private String activeStatus;
    private LocalDateTime createdAt;

}
