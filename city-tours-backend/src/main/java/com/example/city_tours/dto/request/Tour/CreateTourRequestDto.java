package com.example.city_tours.dto.request.Tour;

import com.example.city_tours.entity.Schedule;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

import java.lang.reflect.Array;
import java.util.List;
import java.util.Map;
import java.util.Set;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class CreateTourRequestDto {

    private String name;
    private String description;
    private String address;
    private Double price;
    private String thumbnail;
    private Set<Schedule> schedules;

}