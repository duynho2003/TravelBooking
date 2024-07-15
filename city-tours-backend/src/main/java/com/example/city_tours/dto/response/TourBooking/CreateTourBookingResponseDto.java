package com.example.city_tours.dto.response.TourBooking;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class CreateTourBookingResponseDto {

    private Long id;
    private Long tourId;
    private Long customerId;
    private String startTime;
    private int adults;
    private int children;
    private int baby;
    private Double amount;
    private LocalDateTime createdAt;
    private String bookingStatus;

}