package com.example.city_tours.dto.request.Room;

import com.example.city_tours.dto.request.RoomHoliday.CreateRoomHolidayRequestDto;
import com.example.city_tours.dto.request.RoomView.CreateRoomViewRequestDto;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Set;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class CreateRoomRequestDto {

    private String roomNumber;
    private String type;
    private String category;
    private Double defaultPrice;
    private Double weekdayPrice;
    private Double weekendPrice;
    private Double discount;
    private int quantityAdult;
    private int quantityChild;
    private Double childCharge;
    private int quantityBaby;
    private Double babyCharge;
    private Set<CreateRoomHolidayRequestDto> roomHolidays;
    private Set<CreateRoomViewRequestDto> roomViews;
    private Set<String> imageUrls;

}