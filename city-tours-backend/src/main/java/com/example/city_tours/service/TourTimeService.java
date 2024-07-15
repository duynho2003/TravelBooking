package com.example.city_tours.service;

import com.example.city_tours.dto.request.User.CreateAccountRequestDto;
import com.example.city_tours.dto.request.User.UpdateAccountRequestDto;
import com.example.city_tours.dto.response.User.CreateAccountResponseDto;
import com.example.city_tours.dto.response.User.GetAccountByIdResponseDto;
import com.example.city_tours.dto.response.User.GetAllAccountsResponseDto;
import com.example.city_tours.dto.response.User.UpdateAccountResponseDto;

import java.util.List;

public interface TourTimeService {

    void deleteTourTime(Long tourTimeId);

}
