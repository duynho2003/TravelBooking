package com.example.city_tours.service;

import com.example.city_tours.dto.request.Room.CreateRoomRequestDto;
import com.example.city_tours.dto.request.Room.UpdateRoomRequestDto;
import com.example.city_tours.dto.response.Room.CreateRoomResponseDto;
import com.example.city_tours.dto.response.Room.GetRoomByIdResponseDto;
import com.example.city_tours.dto.response.Room.UpdateRoomResponseDto;
import com.example.city_tours.dto.response.Statistical.IncomeResponseDto;
import jakarta.transaction.Transactional;

public interface IncomeService {
    IncomeResponseDto getDailyIncome(String date);
}
