package com.example.city_tours.dto.response.Statistical;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class StatisticalResponseDto {

    private int quantityUsers;
    private Double income;
    private int quantityBookings;
    private int quantityTransactions;

}