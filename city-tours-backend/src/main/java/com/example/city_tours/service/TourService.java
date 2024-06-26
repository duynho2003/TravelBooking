package com.example.city_tours.service;

import com.example.city_tours.dto.request.Tour.CreateTourRequestDto;
import com.example.city_tours.dto.request.Tour.UpdateTourRequestDto;
import com.example.city_tours.dto.response.Tour.CreateTourResponseDto;
import com.example.city_tours.dto.response.Tour.GetAllToursResponseDto;
import com.example.city_tours.dto.response.Tour.GetTourByIdResponseDto;
import com.example.city_tours.dto.response.Tour.UpdateTourResponseDto;

import java.util.List;

public interface TourService {

    CreateTourResponseDto createTour(CreateTourRequestDto createTourRequestDto);

    UpdateTourResponseDto updateTour(Long tourId, UpdateTourRequestDto updateTourRequestDto);

    void deleteTour(Long tourId);

    List<GetAllToursResponseDto> getAllTours(int page, int limit);

    GetTourByIdResponseDto getTourById(Long tourId);

//    UpdateTourResponseDto updateTour(Long tourId, UpdateTourRequestDto updateTourRequestDto);

}
