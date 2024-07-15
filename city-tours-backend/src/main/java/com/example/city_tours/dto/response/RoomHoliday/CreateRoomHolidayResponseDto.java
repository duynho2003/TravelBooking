package com.example.city_tours.dto.response.RoomHoliday;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class CreateRoomHolidayResponseDto {

    private Long id;
    private String date;
    private Double price;

}