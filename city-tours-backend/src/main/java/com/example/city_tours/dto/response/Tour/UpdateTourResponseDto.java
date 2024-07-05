package com.example.city_tours.dto.response.Tour;

import com.example.city_tours.entity.Schedule;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class UpdateTourResponseDto {

    private Long id;
    private String name;
    private String description;
    private String depart;
    private Double rating;
    private int numberOfRating;
    private Double price;
    private Double discount;
    private String locations;
    private int adults;
    private int children;
    private int baby;
    private String bookedStatus;
    private String activeStatus;
    private String thumbnail;
    private List<Schedule> schedules;

}