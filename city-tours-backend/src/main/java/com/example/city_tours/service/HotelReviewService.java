package com.example.city_tours.service;

import com.example.city_tours.dto.request.HotelReview.CreateHotelReviewRequestDto;
import com.example.city_tours.dto.request.RoomBooking.CreateRoomBookingRequestDto;
import com.example.city_tours.dto.response.HotelReview.CreateHotelReviewResponseDto;
import com.example.city_tours.dto.response.RoomBooking.CreateRoomBookingResponseDto;
import com.example.city_tours.dto.response.User.PageResponseDto;

public interface HotelReviewService {

    CreateHotelReviewResponseDto createHotelReview(CreateHotelReviewRequestDto createHotelReviewRequestDto);

    PageResponseDto getAllHotelReviews(int page, int limit);

    PageResponseDto getHotelReviewsByHotelId(Long hotelId, int page, int limit);

//    UpdateTourResponseDto updateTour(Long tourId, UpdateTourRequestDto updateTourRequestDto);
//
//    void deleteTour(Long tourId);
//
//    List<GetAllToursResponseDto> getAllTours(int page, int limit);
//
//    GetTourByIdResponseDto getTourById(Long tourId);

//    UpdateTourResponseDto updateTour(Long tourId, UpdateTourRequestDto updateTourRequestDto);

}
