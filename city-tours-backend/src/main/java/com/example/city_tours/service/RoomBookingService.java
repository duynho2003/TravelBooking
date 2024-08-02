package com.example.city_tours.service;

import com.example.city_tours.dto.request.RoomBooking.CreateRoomBookingRequestDto;
import com.example.city_tours.dto.request.TourRoomBooking.CreateTourRoomBookingRequestDto;
import com.example.city_tours.dto.response.RoomBooking.CreateRoomBookingResponseDto;
import com.example.city_tours.dto.response.RoomBooking.GetRoomBookingsByUserIdResponseDto;
import com.example.city_tours.dto.response.TourRoomBooking.CreateTourRoomBookingResponseDto;
import com.example.city_tours.dto.response.User.PageResponseDto;

public interface RoomBookingService {

    CreateRoomBookingResponseDto createRoomBooking(CreateRoomBookingRequestDto createRoomBookingRequestDto);

    PageResponseDto getAllRoomBookings(int page, int limit, String hotelName, Integer hotelId);

    PageResponseDto getRoomBookingsByUserId(Long userId, int page, int limit);

//    UpdateTourResponseDto updateTour(Long tourId, UpdateTourRequestDto updateTourRequestDto);
//
//    void deleteTour(Long tourId);
//
//    List<GetAllToursResponseDto> getAllTours(int page, int limit);
//
//    GetTourByIdResponseDto getTourById(Long tourId);

//    UpdateTourResponseDto updateTour(Long tourId, UpdateTourRequestDto updateTourRequestDto);

}
