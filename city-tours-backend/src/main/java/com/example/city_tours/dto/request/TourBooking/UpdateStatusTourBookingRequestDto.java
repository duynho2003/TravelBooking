package com.example.city_tours.dto.request.TourBooking;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class UpdateStatusTourBookingRequestDto {

    private String bookingStatus;

}