package com.example.city_tours.dto.request.Tour;

import com.example.city_tours.entity.Schedule;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

import java.lang.reflect.Array;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Set;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class CreateTourRequestDto {

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
    private String thumbnail;
    private Set<Schedule> schedules;

}