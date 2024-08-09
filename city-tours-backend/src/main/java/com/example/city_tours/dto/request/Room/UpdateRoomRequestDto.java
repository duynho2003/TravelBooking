package com.example.city_tours.dto.request.Room;

import com.example.city_tours.dto.request.RoomHoliday.UpdateRoomHolidayRequestDto;
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
public class UpdateRoomRequestDto {

    private String roomNumber;
    private String type;
    private Double basePrice;
    private Double weekendPrice;
    private Double discount;
    private int quantityAdult;
    private int quantityChild;
    private String bookedStatus;
    private String activeStatus;
    private Set<UpdateRoomHolidayRequestDto> roomHolidays;
    private Set<String> imageUrls;
    private Set<CreateRoomViewRequestDto> roomViews;

}