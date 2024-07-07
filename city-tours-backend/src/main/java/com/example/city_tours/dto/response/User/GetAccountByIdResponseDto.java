package com.example.city_tours.dto.response.User;

import com.example.city_tours.dto.response.Customer.CreateCustomerResponseDto;
import com.example.city_tours.dto.response.RoomBooking.GetRoomBookingResponseDto;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.Set;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class GetAccountByIdResponseDto {

    private Long id;
    private String username;
    private String email;
    private String password;
    private Set<String> roles;
    private String status;
    private LocalDateTime createAt;
    private LocalDateTime updatedAt;
    private CreateCustomerResponseDto customer;
    private Set<GetRoomBookingResponseDto> roomBookings;
    
}
