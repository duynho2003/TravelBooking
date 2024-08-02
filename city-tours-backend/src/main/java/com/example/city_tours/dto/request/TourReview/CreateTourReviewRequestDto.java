package com.example.city_tours.dto.request.TourReview;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class CreateTourReviewRequestDto {

    private Long userId;
    private Long tourId;
    private Long tourBookingId;
    private String customerName;
    private String content;
    private Double rating;

}