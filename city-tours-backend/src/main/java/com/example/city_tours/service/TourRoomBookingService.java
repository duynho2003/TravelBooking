package com.example.city_tours.service;

import com.example.city_tours.dto.request.Tour.CreateTourRequestDto;
import com.example.city_tours.dto.request.Tour.UpdateTourRequestDto;
import com.example.city_tours.dto.request.TourRoomBooking.CreateTourRoomBookingRequestDto;
import com.example.city_tours.dto.response.Tour.CreateTourResponseDto;
import com.example.city_tours.dto.response.Tour.GetAllToursResponseDto;
import com.example.city_tours.dto.response.Tour.GetTourByIdResponseDto;
import com.example.city_tours.dto.response.Tour.UpdateTourResponseDto;
import com.example.city_tours.dto.response.TourRoomBooking.CreateTourRoomBookingResponseDto;

import java.util.List;

public interface TourRoomBookingService {

    CreateTourRoomBookingResponseDto createTourRoomBooking(CreateTourRoomBookingRequestDto createTourRoomBookingRequestDto);

//    UpdateTourResponseDto updateTour(Long tourId, UpdateTourRequestDto updateTourRequestDto);
//
//    void deleteTour(Long tourId);
//
//    List<GetAllToursResponseDto> getAllTours(int page, int limit);
//
//    GetTourByIdResponseDto getTourById(Long tourId);

//    UpdateTourResponseDto updateTour(Long tourId, UpdateTourRequestDto updateTourRequestDto);

}
