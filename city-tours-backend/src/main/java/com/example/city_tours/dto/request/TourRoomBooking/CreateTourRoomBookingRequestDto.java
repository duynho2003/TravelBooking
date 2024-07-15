package com.example.city_tours.dto.request.TourRoomBooking;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class CreateTourRoomBookingRequestDto {

    private Long tourId;
    private Long roomId;
    private String date;
    private String startHour;
    private String endHour;
    private Double price;

}