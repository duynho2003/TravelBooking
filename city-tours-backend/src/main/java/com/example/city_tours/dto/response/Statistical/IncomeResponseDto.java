package com.example.city_tours.dto.response.Statistical;

import com.example.city_tours.dto.response.TourLocation.GetATourLocationResponseDto;
import com.example.city_tours.dto.response.TourTime.GetATourTimeResponseDto;
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
public class IncomeResponseDto {

    private String period;
    private int quantityBookings;
    private Double totalIncome;

}