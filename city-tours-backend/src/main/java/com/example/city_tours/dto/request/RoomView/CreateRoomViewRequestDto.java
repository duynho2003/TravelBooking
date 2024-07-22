package com.example.city_tours.dto.request.RoomView;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class CreateRoomViewRequestDto {

    private String view;
    private String viewImages;

}