package com.example.city_tours.dto.response.Tour;

import com.example.city_tours.entity.Schedule;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class CreateTourResponseDto {

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
    private List<Schedule> schedules;
    private LocalDateTime createdAt;

}
