package com.example.city_tours.dto.request.HotelReview;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class CreateHotelReviewRequestDto {

    private Long userId;
    private Long hotelId;
    private Long roomBookingId;
    private String customerName;
    private String content;
    private Double rating;

}