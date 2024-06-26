package com.example.city_tours.dto.response.Hotel;

import com.example.city_tours.dto.response.Room.RoomResponseDto;
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
public class UpdateHotelResponseDto {

    private Long id;
    private String name;
    private String description;
    private String address;
    private Double rating;
    private int numberOfRating;
    private String activeStatus;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<RoomResponseDto> rooms;
    private List<String> thumbnailUrls;

}