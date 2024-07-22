package com.example.city_tours.dto.response.Room;

import com.example.city_tours.dto.response.RoomHoliday.GetAllRoomHolidaysResponseDto;
import com.example.city_tours.dto.response.RoomView.GetARoomViewResponseDto;
import com.example.city_tours.dto.response.Tour.GetTourRoomBookingResponseDto;
import com.example.city_tours.entity.TourRoomBooking;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class RoomResponseDto {

    private Long id;
    private String roomNumber;
    private String type;
    private String category;
    private Double defaultPrice;
    private Double weekdayPrice;
    private Double weekendPrice;
    private Double discount;
    private int quantityAdult;
    private int quantityChild;
    private Double childCharge;
    private int quantityBaby;
    private Double babyCharge;
    private String bookedStatus;
    private String activeStatus;
    private LocalDateTime createdAt;
    private List<GetARoomViewResponseDto> roomViews;
    private List<GetAllRoomHolidaysResponseDto> roomHolidays;
    private List<String> imageUrls;
    private List<GetTourRoomBookingResponseDto> tourRoomBookings;

}