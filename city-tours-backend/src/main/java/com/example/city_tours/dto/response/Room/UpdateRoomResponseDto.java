package com.example.city_tours.dto.response.Room;

import com.example.city_tours.dto.response.RoomHoliday.UpdateRoomHolidayResponseDto;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class UpdateRoomResponseDto {

    private Long id;
    private String roomNumber;
    private String type;
    private Double basePrice;
    private Double weekendPrice;
    private Double discount;
    private int quantityAdult;
    private int quantityChild;
    private String activeStatus;
    private LocalDateTime updatedAt;
    private List<UpdateRoomHolidayResponseDto> roomHolidays;
    private List<String> imageUrls;

}