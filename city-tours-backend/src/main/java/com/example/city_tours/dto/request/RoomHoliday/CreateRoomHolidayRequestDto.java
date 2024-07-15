package com.example.city_tours.dto.request.RoomHoliday;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Set;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class CreateRoomHolidayRequestDto {

    private String date;
    private Double price;

}