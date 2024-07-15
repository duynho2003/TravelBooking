package com.example.city_tours.dto.request.Tour;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class UpdateScheduleRequestDto {

    private Long id;
    private String dayOfWeek;
    private String date;

}