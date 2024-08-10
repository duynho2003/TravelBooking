package com.example.city_tours.dto.response.RoomBooking;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class UpdateStatusRoomBookingResponseDto {

    private Long id;
    private String bookingStatus;

}