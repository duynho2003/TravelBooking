package com.example.city_tours.dto.request.Room;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Set;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class UpdateRoomRequestDto {

    private String roomNumber;
    private String type;
    private Double price;
    private String bookedStatus;
    private String activeStatus;
    private Set<String> imageUrls;

}