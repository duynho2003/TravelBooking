package com.example.city_tours.dto.request.TourBooking;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class CreateTourBookingRequestDto {

    private Long tourId;
    private Long userId;
    private String startTime;
    private int adults;
    private int children;
    private int baby;
    private Double amount;
    private String bookingStatus;

}