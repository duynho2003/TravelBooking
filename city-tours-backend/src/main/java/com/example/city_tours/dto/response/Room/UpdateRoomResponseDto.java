package com.example.city_tours.dto.response.Room;

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
public class UpdateRoomResponseDto {

    private Long id;

    private String roomNumber;

    private String type;

    private Double price;

    private String bookedStatus;

    private String activeStatus;

    private LocalDateTime updatedAt;

    private List<String> imageUrls;

}