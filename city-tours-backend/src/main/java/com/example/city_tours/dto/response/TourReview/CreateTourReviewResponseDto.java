package com.example.city_tours.dto.response.TourReview;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class CreateTourReviewResponseDto {

    private Long id;
    private Long customerId;
    private Long tourId;
    private String customerName;
    private String content;
    private Double rating;
    private String createdAt;

}