package com.example.city_tours.dto.response.Room;

import com.example.city_tours.entity.Hotel;
import com.example.city_tours.enums.ActiveStatus;
import com.example.city_tours.enums.BookedStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class CreateRoomResponseDto {

    private Long id;

    private String roomNumber;

    private String type;

    private Double price;

    private String bookedStatus;

    private String activeStatus;

    private LocalDateTime createdAt;

    private Long hotelId;

    private List<String> imageUrls;

}