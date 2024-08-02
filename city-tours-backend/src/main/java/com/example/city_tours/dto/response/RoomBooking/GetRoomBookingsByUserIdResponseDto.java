package com.example.city_tours.dto.response.RoomBooking;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class GetRoomBookingsByUserIdResponseDto {

    private Long id;
    private String startDate;
    private String endDate;
    private Double price;
    private String reviewStatus;
    private String roomType;
    private Long customerId;
    private Long roomId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String hotelName;

}
