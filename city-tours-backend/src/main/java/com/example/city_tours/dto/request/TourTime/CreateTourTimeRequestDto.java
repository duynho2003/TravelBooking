package com.example.city_tours.dto.request.TourTime;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Set;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class CreateTourTimeRequestDto {

    private String startDate;
    private String endDate;

}