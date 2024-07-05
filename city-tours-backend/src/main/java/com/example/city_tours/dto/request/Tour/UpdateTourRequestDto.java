package com.example.city_tours.dto.request.Tour;

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
public class UpdateTourRequestDto {

    private String name;
    private String description;
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
    private Set<Schedule> schedules;

}