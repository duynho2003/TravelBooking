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
    private String address;
    private Double price;
    private String bookedStatus;
    private String activeStatus;
    private String thumbnail;
    private Set<Schedule> schedules;

}