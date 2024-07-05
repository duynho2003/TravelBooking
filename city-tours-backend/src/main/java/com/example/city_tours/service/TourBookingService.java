package com.example.city_tours.service;

import com.example.city_tours.dto.request.TourBooking.CreateTourBookingRequestDto;
import com.example.city_tours.dto.request.TourBooking.UpdateTourBookingRequestDto;
import com.example.city_tours.dto.request.TourRoomBooking.CreateTourRoomBookingRequestDto;
import com.example.city_tours.dto.response.TourBooking.CreateTourBookingResponseDto;
import com.example.city_tours.dto.response.TourBooking.GetAllTourBookingsResponseDto;
import com.example.city_tours.dto.response.TourBooking.UpdateTourBookingResponseDto;
import com.example.city_tours.dto.response.TourRoomBooking.CreateTourRoomBookingResponseDto;

import java.util.List;

public interface TourBookingService {

    CreateTourBookingResponseDto createTourBooking(CreateTourBookingRequestDto createTourBookingRequestDto);
    UpdateTourBookingResponseDto updateTourBooking(UpdateTourBookingRequestDto updateTourBookingRequestDto);
//
//    void deleteTour(Long tourId);
//
    List<GetAllTourBookingsResponseDto> getAllTourBookings(int page, int limit);
//
//    GetTourByIdResponseDto getTourById(Long tourId);

//    UpdateTourResponseDto updateTour(Long tourId, UpdateTourRequestDto updateTourRequestDto);

}
