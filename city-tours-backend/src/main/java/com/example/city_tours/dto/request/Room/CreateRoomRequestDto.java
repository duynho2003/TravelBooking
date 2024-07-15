package com.example.city_tours.dto.request.Room;

import com.example.city_tours.dto.request.RoomHoliday.CreateRoomHolidayRequestDto;
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
    private Double basePrice;
    private Double weekendPrice;
    private Double discount;
    private int numberOfResidents;
    private Set<CreateRoomHolidayRequestDto> roomHolidays;
    private Set<String> imageUrls;

}