package com.example.city_tours.service;

import com.example.city_tours.dto.request.Hotel.CreateHotelRequestDto;
import com.example.city_tours.dto.request.Room.CreateRoomRequestDto;
import com.example.city_tours.dto.request.Room.UpdateRoomRequestDto;
import com.example.city_tours.dto.response.Hotel.CreateHotelResponseDto;
import com.example.city_tours.dto.response.Hotel.GetAllHotelsResponseDto;
import com.example.city_tours.dto.response.Room.CreateRoomResponseDto;
import com.example.city_tours.dto.response.Room.GetRoomByIdResponseDto;
import com.example.city_tours.dto.response.Room.UpdateRoomResponseDto;
import jakarta.transaction.Transactional;

import java.util.List;

public interface RoomService {

    CreateRoomResponseDto createRoom(Long hotelId, CreateRoomRequestDto createRoomRequestDto);

    GetRoomByIdResponseDto getRoomById(Long roomId);

    UpdateRoomResponseDto updateRoom(Long roomId, UpdateRoomRequestDto updateRoomRequestDto);

    @Transactional
    void deleteRoomImagesByRoomId(Long roomId);

//    UpdateTourResponseDto updateTour(Long tourId, UpdateTourRequestDto updateTourRequestDto);
//
    void deleteRoom(Long roomId);
//
//    List<GetAllHotelsResponseDto> getAllHotels(int page, int limit);
//
//    GetTourByIdResponseDto getTourById(Long tourId);

//    UpdateTourResponseDto updateTour(Long tourId, UpdateTourRequestDto updateTourRequestDto);

}
