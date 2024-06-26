package com.example.city_tours.dto.request.Tour;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class CreateScheduleRequestDto {

    private String startDay;
    private String endDay;
    private List<CreateScheduleDaysTimeRequestDto> dayTimes;

}
