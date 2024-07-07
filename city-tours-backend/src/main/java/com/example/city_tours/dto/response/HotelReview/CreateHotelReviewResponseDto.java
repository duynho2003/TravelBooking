package com.example.city_tours.dto.response.HotelReview;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class CreateHotelReviewResponseDto {

    private Long id;
    private Long customerId;
    private Long hotelId;
    private String customerName;
    private String content;
    private Double rating;
    private String createdAt;

}