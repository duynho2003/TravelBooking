package com.example.city_tours.dto.response.Tour;

import com.example.city_tours.entity.Schedule;
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
public class GetTourRoomBookingResponseDto {

    private Long id;

    private String date;

    private String startHour;

    private String endHour;

    private Double price;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

}
