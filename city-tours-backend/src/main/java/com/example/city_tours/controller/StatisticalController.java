package com.example.city_tours.controller;

import com.example.city_tours.common.ApiErrorResponse;
import com.example.city_tours.common.ApiSuccessResponse;
import com.example.city_tours.common.ErrorCode;
import com.example.city_tours.dto.response.Statistical.MonthlyIncomeResponseDto;
import com.example.city_tours.dto.response.Statistical.StatisticalResponseDto;
import com.example.city_tours.entity.RoomBooking;
import com.example.city_tours.entity.TourBooking;
import com.example.city_tours.exception.ServerErrorException;
import com.example.city_tours.repository.RoomBookingRepository;
import com.example.city_tours.repository.TourBookingRepository;
import com.example.city_tours.service.StatisticalService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@AllArgsConstructor
@RestController
@RequestMapping("/api/v1/statisticals")
public class StatisticalController {

    private StatisticalService statisticalService;
    private final RoomBookingRepository roomBookingRepository;
    private final TourBookingRepository tourBookingRepository;

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping("")
    public ResponseEntity<?> getStatistical(
            @RequestParam(required = false) String dateStr,
            @RequestParam(required = false) String weekStr,
            @RequestParam(required = false) String monthStr,
            @RequestParam(required = false) String yearStr
    ) {
        try {
            StatisticalResponseDto responseDto = statisticalService.getStatistical(dateStr, weekStr, monthStr, yearStr);

            return ResponseEntity
                    .status(HttpStatus.OK)
                    .body(new ApiSuccessResponse<>(
                            HttpStatus.OK.value(),
                            "Get statistical successfully",
                            responseDto
                    ));
        } catch (ServerErrorException e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiErrorResponse(
                            HttpStatus.INTERNAL_SERVER_ERROR.value(),
                            e.getMessage(),
                            ErrorCode.INTERNAL_SERVER_ERROR,
                            "http://localhost:5050/docs/errors/1012"
                    ));
        }
    }

    @GetMapping("/monthly-income-hotels/{year}")
    public Map<String, Double> getMonthlyIncomeHotels(@PathVariable int year) {
        Map<String, Double> monthlyIncomeHotelsMap = new LinkedHashMap<>();

        for (int month = 1; month <= 12; month++) {
            LocalDateTime startDateTime = LocalDateTime.of(year, month, 1, 0, 0);
            LocalDateTime endDateTime = startDateTime.plusMonths(1);

            double monthlyIncomeHotels = calculateMonthlyIncomeHotels(startDateTime, endDateTime);
            monthlyIncomeHotelsMap.put(String.format("%04d-%02d", year, month), monthlyIncomeHotels);
        }

        return monthlyIncomeHotelsMap;
    }

    private double calculateMonthlyIncomeHotels(LocalDateTime startDateTime, LocalDateTime endDateTime) {
        List<RoomBooking> roomBookings = roomBookingRepository.findByCreatedAtBetween(startDateTime, endDateTime);
        return roomBookings.stream()
                .filter(roomBooking -> roomBooking.getPrice() != null)
                .mapToDouble(RoomBooking::getPrice)
                .sum();
    }

    @GetMapping("/monthly-income-tours/{year}")
    public Map<String, Double> getMonthlyIncomeTours(@PathVariable int year) {
        Map<String, Double> monthlyIncomeToursMap = new LinkedHashMap<>();

        for (int month = 1; month <= 12; month++) {
            LocalDateTime startDateTime = LocalDateTime.of(year, month, 1, 0, 0);
            LocalDateTime endDateTime = startDateTime.plusMonths(1);

            double monthlyIncomeTours = calculateMonthlyIncomeTours(startDateTime, endDateTime);
            monthlyIncomeToursMap.put(String.format("%04d-%02d", year, month), monthlyIncomeTours);
        }

        return monthlyIncomeToursMap;
    }

    private double calculateMonthlyIncomeTours(LocalDateTime startDateTime, LocalDateTime endDateTime) {
        List<TourBooking> tourBookings = tourBookingRepository.findByCreatedAtBetween(startDateTime, endDateTime);
        return tourBookings.stream()
                .filter(tourBooking -> tourBooking.getAmount() != null)
                .mapToDouble(TourBooking::getAmount)
                .sum();
    }

}
