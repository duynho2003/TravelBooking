package com.example.city_tours.service;

import com.example.city_tours.dto.request.Room.CreateRoomRequestDto;
import com.example.city_tours.dto.request.Room.UpdateRoomRequestDto;
import com.example.city_tours.dto.request.RoomHoliday.CreateRoomHolidayRequestDto;
import com.example.city_tours.dto.request.RoomHoliday.UpdateRoomHolidayRequestDto;
import com.example.city_tours.dto.response.Room.CreateRoomResponseDto;
import com.example.city_tours.dto.response.Room.GetRoomByIdResponseDto;
import com.example.city_tours.dto.response.Room.UpdateRoomResponseDto;
import com.example.city_tours.dto.response.RoomBooking.GetRoomBookingResponseDto;
import com.example.city_tours.dto.response.RoomHoliday.CreateRoomHolidayResponseDto;
import com.example.city_tours.dto.response.RoomHoliday.GetAllRoomHolidaysResponseDto;
import com.example.city_tours.dto.response.RoomHoliday.UpdateRoomHolidayResponseDto;
import com.example.city_tours.dto.response.Statistical.IncomeResponseDto;
import com.example.city_tours.dto.response.Tour.GetTourRoomBookingResponseDto;
import com.example.city_tours.entity.*;
import com.example.city_tours.enums.ActiveStatus;
import com.example.city_tours.enums.BookedStatus;
import com.example.city_tours.exception.ResourceNotFoundException;
import com.example.city_tours.repository.*;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class IncomeServiceImpl implements IncomeService{

    private final TourBookingRepository tourBookingRepository;

    @Override
    public IncomeResponseDto getDailyIncome(String date) {
        LocalDate localDate = LocalDate.parse(date);

        LocalDateTime startOfDay = localDate.atStartOfDay();
        LocalDateTime endOfDay = localDate.plusDays(1).atStartOfDay();

        List<TourBooking> tourBookings = tourBookingRepository.findByCreatedAtBetween(startOfDay, endOfDay);

        int totalQuantityBookings = tourBookings.size();
        Double totalIncome = 0.0;

        // Calculate total income using a loop
        for (TourBooking booking : tourBookings) {
            totalIncome += booking.getAmount();
        }

        IncomeResponseDto incomeResponseDto = new IncomeResponseDto();
        incomeResponseDto.setPeriod("daily");
        incomeResponseDto.setQuantityBookings(totalQuantityBookings);
        incomeResponseDto.setTotalIncome(totalIncome);

        return incomeResponseDto;
    }

}
