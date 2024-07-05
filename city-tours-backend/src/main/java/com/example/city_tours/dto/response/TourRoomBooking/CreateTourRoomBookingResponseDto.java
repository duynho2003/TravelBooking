package com.example.city_tours.dto.response.TourRoomBooking;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class CreateTourRoomBookingResponseDto {

    private Long id;
    private Long tourId;
    private Long roomId;
    private String date;
    private String startHour;
    private String endHour;
    private Double price;
    private String createdAt;

}