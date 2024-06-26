package com.example.city_tours.service;

import com.example.city_tours.dto.request.Hotel.CreateHotelRequestDto;
import com.example.city_tours.dto.request.Hotel.UpdateHotelRequestDto;
import com.example.city_tours.dto.request.Tour.CreateTourRequestDto;
import com.example.city_tours.dto.request.Tour.UpdateTourRequestDto;
import com.example.city_tours.dto.response.Hotel.CreateHotelResponseDto;
import com.example.city_tours.dto.response.Hotel.GetAllHotelsResponseDto;
import com.example.city_tours.dto.response.Hotel.GetHotelByIdResponseDto;
import com.example.city_tours.dto.response.Hotel.UpdateHotelResponseDto;
import com.example.city_tours.dto.response.Tour.CreateTourResponseDto;
import com.example.city_tours.dto.response.Tour.GetAllToursResponseDto;
import com.example.city_tours.dto.response.Tour.GetTourByIdResponseDto;
import com.example.city_tours.dto.response.Tour.UpdateTourResponseDto;
import jakarta.transaction.Transactional;

import java.util.List;

public interface HotelService {

    CreateHotelResponseDto createHotel(CreateHotelRequestDto createHotelRequestDto);
    UpdateHotelResponseDto updateHotel(Long hotelId, UpdateHotelRequestDto updateHotelRequestDto);

    @Transactional
    void deleteHotelImagesByHotelId(Long hotelId);

    //
//    void deleteTour(Long tourId);
//
    List<GetAllHotelsResponseDto> getAllHotels(int page, int limit);

    GetHotelByIdResponseDto getHotelById(Long hotelId);

//    UpdateTourResponseDto updateTour(Long tourId, UpdateTourRequestDto updateTourRequestDto);

}
