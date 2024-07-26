package com.example.city_tours.service;

import com.example.city_tours.dto.response.Statistical.StatisticalResponseDto;
import com.example.city_tours.entity.*;
import com.example.city_tours.exception.ServerErrorException;
import com.example.city_tours.repository.*;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.text.DecimalFormat;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Year;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.time.temporal.IsoFields;
import java.util.List;

@Service
@AllArgsConstructor
public class StatisticalServiceImpl implements StatisticalService{

    private final TourBookingRepository tourBookingRepository;
    private final TransactionRepository transactionRepository;
    private final RoomBookingRepository roomBookingRepository;
    private final CustomerRepository customerRepository;

    public StatisticalResponseDto getStatistical(String dateStr, String weekStr, String monthStr, String yearStr) {

        LocalDateTime startDateTime = null;
        LocalDateTime endDateTime = null;

        try {
            if (dateStr != null) {
                LocalDate date = LocalDate.parse(dateStr, DateTimeFormatter.ISO_DATE);
                startDateTime = date.atStartOfDay();
                endDateTime = startDateTime.plusDays(1);
            } else if (weekStr != null) {
                String[] parts = weekStr.split("-");
                Year weekYear = Year.parse(parts[0]);
                int weekNumber = Integer.parseInt(parts[1].substring(0, parts[1].indexOf("th")));
                startDateTime = LocalDate.now().withYear(weekYear.getValue()).with(IsoFields.WEEK_OF_WEEK_BASED_YEAR, weekNumber).atStartOfDay();
                endDateTime = startDateTime.plusWeeks(1);
            } else if (monthStr != null) {
                YearMonth yearMonth = YearMonth.parse(monthStr, DateTimeFormatter.ofPattern("yyyy-MM"));
                startDateTime = yearMonth.atDay(1).atStartOfDay();
                endDateTime = startDateTime.plusMonths(1);
            } else if (yearStr != null) {
                Year year = Year.parse(yearStr);
                startDateTime = LocalDate.of(year.getValue(), 1, 1).atStartOfDay();
                endDateTime = startDateTime.plusYears(1);
            }
        } catch (DateTimeParseException e) {
            throw new ServerErrorException("Invalid date format");
        }

        LocalDateTime finalStartDateTime = startDateTime;
        LocalDateTime finalEndDateTime = endDateTime;
        int quantityCustomers = (int) customerRepository.findAll().stream()
                .filter(customer -> isWithinRange(customer.getCreatedAt(), finalStartDateTime, finalEndDateTime))
                .count();

        double incomeHotels = calculateRoomBookingIncome(roomBookingRepository.findAll(), startDateTime, endDateTime);
        double incomeTours = calculateTourBookingIncome(tourBookingRepository.findAll(), startDateTime, endDateTime);

        LocalDateTime finalStartDateTime1 = startDateTime;
        LocalDateTime finalEndDateTime1 = endDateTime;
        int quantityTransactions = (int) transactionRepository.findAll().stream()
                .filter(transaction -> isWithinRange(transaction.getCreatedAt(), finalStartDateTime1, finalEndDateTime1))
                .count();

        StatisticalResponseDto responseDto = new StatisticalResponseDto();
        responseDto.setQuantityCustomers(quantityCustomers);
        DecimalFormat df = new DecimalFormat("#.##");
        responseDto.setIncomeHotels(Double.valueOf(df.format(incomeHotels)));
        responseDto.setIncomeTours(Double.valueOf(df.format(incomeTours)));
        responseDto.setQuantityTransactions(quantityTransactions);

        return responseDto;
    }

    private double calculateRoomBookingIncome(List<RoomBooking> roomBookings, LocalDateTime startDateTime, LocalDateTime endDateTime) {
        return roomBookings.stream()
                .filter(roomBooking -> isWithinRange(roomBooking.getCreatedAt(), startDateTime, endDateTime))
                .filter(roomBooking -> roomBooking.getPrice() != null)
                .mapToDouble(RoomBooking::getPrice)
                .sum();
    }

    private double calculateTourBookingIncome(List<? extends TourBooking> bookings, LocalDateTime startDateTime, LocalDateTime endDateTime) {
        return bookings.stream()
                .filter(booking -> isWithinRange(booking.getCreatedAt(), startDateTime, endDateTime))
                .filter(booking -> booking.getAmount() != null)
                .mapToDouble(TourBooking::getAmount)
                .sum();
    }

    private boolean isWithinRange(LocalDateTime date, LocalDateTime startDateTime, LocalDateTime endDateTime) {
        if (startDateTime == null || endDateTime == null) {
            return true;
        }
        return !date.isBefore(startDateTime) && date.isBefore(endDateTime);
    }

}
