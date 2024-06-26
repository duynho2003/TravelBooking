package com.example.city_tours.dto.response.Tour;

import com.example.city_tours.entity.Schedule;
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
    private String address;
    private Double rating;
    private int numberOfRating;
    private Double price;
    private String thumbnail;
    private String bookedStatus;
    private String activeStatus;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<Schedule> schedules;

}