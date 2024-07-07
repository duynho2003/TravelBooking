package com.example.city_tours.dto.response.RoomBooking;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class CreateRoomBookingResponseDto {

    private Long id;
    private Long customerId;
    private Long roomId;
    private String date;
    private String startHour;
    private String endHour;
    private Double price;
    private String reviewStatus;
    private String roomType;
    private String createdAt;

}