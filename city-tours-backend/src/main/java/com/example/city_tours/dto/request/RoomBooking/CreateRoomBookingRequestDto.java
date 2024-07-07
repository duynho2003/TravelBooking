package com.example.city_tours.dto.request.RoomBooking;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class CreateRoomBookingRequestDto {

    private Long userId;
    private Long roomId;
    private String date;
    private String startHour;
    private String endHour;
    private Double price;
    private String roomType;

}