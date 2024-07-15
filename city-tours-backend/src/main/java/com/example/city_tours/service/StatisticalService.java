package com.example.city_tours.service;

import com.example.city_tours.dto.response.Statistical.IncomeResponseDto;
import com.example.city_tours.dto.response.Statistical.StatisticalResponseDto;

public interface StatisticalService {
    StatisticalResponseDto getStatistical();
}
