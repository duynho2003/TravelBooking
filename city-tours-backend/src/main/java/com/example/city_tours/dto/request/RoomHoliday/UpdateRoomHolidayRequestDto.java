package com.example.city_tours.dto.request.RoomHoliday;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class UpdateRoomHolidayRequestDto {

    private Long id;
    private String date;
    private Double price;

}