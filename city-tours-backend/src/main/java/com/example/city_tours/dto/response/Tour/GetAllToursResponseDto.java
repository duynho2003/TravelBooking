package com.example.city_tours.dto.response.Tour;

import com.example.city_tours.dto.response.TourLocation.GetATourLocationResponseDto;
import com.example.city_tours.dto.response.TourTime.GetATourTimeResponseDto;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@JsonInclude(JsonInclude.Include.NON_NULL)
public class GetAllToursResponseDto {

    private Long id;
    private String name;
    private String description;
    private Double rating;
    private int numberOfRating;
    private Double priceAdult;
    private Double priceChild;
    private Double priceBaby;
    private Double discount;
    private String depart;
    private int adults;
    private int child;
    private int baby;
    private String code;
    private String thumbnail;
    private String startTime;
    private String bookedStatus;
    private String activeStatus;
    private LocalDateTime createdAt;
    private LocalDateTime updateAt;
    private List<GetATourTimeResponseDto> tourTimes;
    private List<GetATourLocationResponseDto> tourLocations;

}
