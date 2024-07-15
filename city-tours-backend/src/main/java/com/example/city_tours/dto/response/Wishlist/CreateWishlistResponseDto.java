package com.example.city_tours.dto.response.Wishlist;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class CreateWishlistResponseDto {

    private Long id;
    private String name;
    private Double rating;
    private int numberOfRating;
    private String price;
    private String description;
    private String thumbnail;
    private String type;
    private Long itemId;
    private Long userId;
    private LocalDateTime createdAt;

}
