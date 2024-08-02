package com.example.city_tours.service;

import com.example.city_tours.dto.request.HotelReview.CreateHotelReviewRequestDto;
import com.example.city_tours.dto.request.TourReview.CreateTourReviewRequestDto;
import com.example.city_tours.dto.response.HotelReview.CreateHotelReviewResponseDto;
import com.example.city_tours.dto.response.TourReview.CreateTourReviewResponseDto;
import com.example.city_tours.dto.response.User.PageResponseDto;

public interface TourReviewService {

    CreateTourReviewResponseDto createTourReview(CreateTourReviewRequestDto createTourReviewRequestDto);

    PageResponseDto getAllTourReviews(int page, int limit);

    PageResponseDto getTourReviewsByTourId(Long tourId, int page, int limit);

}
