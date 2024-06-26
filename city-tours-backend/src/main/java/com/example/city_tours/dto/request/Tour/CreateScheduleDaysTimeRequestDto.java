package com.example.city_tours.dto.request.Tour;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class CreateScheduleDaysTimeRequestDto {

    private String startHour;
    private String endHour;
    private String activities;

}
