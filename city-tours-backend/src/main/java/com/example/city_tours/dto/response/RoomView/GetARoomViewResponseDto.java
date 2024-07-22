package com.example.city_tours.dto.response.RoomView;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class GetARoomViewResponseDto {

    private Long id;
    private String name;
    private String images;

}