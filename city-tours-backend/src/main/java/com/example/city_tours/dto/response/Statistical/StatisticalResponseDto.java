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

    private int quantityCustomers;
    private Double incomeHotels;
    private Double incomeTours;
    private int quantityTransactions;
    private double customerChangePercent;
    private double hotelIncomeChangePercent;
    private double tourIncomeChangePercent;
    private double transactionChangePercent;

}