package com.example.city_tours.dto.response.TourBooking;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class UpdateTourBookingResponseDto {

    private Long tourBookingId;
    private String bookingStatus;

}