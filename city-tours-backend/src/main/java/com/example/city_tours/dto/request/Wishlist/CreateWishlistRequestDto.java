package com.example.city_tours.dto.request.Wishlist;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class CreateWishlistRequestDto {

    private String name;
    private Double rating;
    private int numberOfRating;
    private String price;
    private String description;
    private String thumbnail;
    private String type;
    private int itemId;
    private Long userId;

}
