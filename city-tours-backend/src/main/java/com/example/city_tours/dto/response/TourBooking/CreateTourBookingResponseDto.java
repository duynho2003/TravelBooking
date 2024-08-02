package com.example.city_tours.dto.response.TourBooking;

import com.example.city_tours.enums.PaymentStatus;
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
    private String paymentStatus;
    private String code;

}