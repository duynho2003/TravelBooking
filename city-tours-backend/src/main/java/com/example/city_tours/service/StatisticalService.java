package com.example.city_tours.service;

import com.example.city_tours.dto.response.Statistical.MonthlyIncomeResponseDto;
import com.example.city_tours.dto.response.Statistical.StatisticalResponseDto;

public interface StatisticalService {
    StatisticalResponseDto getStatistical(String dateStr, String weekStr, String monthStr, String yearStr);
}
