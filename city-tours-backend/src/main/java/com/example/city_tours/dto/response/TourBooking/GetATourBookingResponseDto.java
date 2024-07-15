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
public class GetATourBookingResponseDto {

    private Long id;
    private Long tourId;
    private String tourName;
    private Long customerId;
    private String customerName;
    private int adults;
    private int children;
    private int baby;
    private Double amount;
    private String bookingStatus;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

}