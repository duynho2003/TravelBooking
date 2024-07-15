package com.example.city_tours.dto.response.TourTime;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class GetATourTimeResponseDto {

    private Long id;
    private String startDate;
    private String endDate;

}