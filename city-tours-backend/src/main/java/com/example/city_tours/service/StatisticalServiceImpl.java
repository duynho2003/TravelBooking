package com.example.city_tours.service;

import com.example.city_tours.dto.response.Statistical.IncomeResponseDto;
import com.example.city_tours.dto.response.Statistical.StatisticalResponseDto;
import com.example.city_tours.entity.*;
import com.example.city_tours.repository.*;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.text.DecimalFormat;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@AllArgsConstructor
public class StatisticalServiceImpl implements StatisticalService{

    private final UserRepository userRepository;
    private final TourBookingRepository tourBookingRepository;
    private final TransactionRepository transactionRepository;
    private final RoomBookingRepository roomBookingRepository;
    private final TourRoomBookingRepository tourRoomBookingRepository;

    @Override
    public StatisticalResponseDto getStatistical() {

        List<User> users = userRepository.findAll();
        int quantityUsers = users.size();

        Double totalIncome = 0.0;
        List<RoomBooking> roomBookings = roomBookingRepository.findAll();
        totalIncome += roomBookings.stream()
                .filter(roomBooking -> roomBooking.getPrice() != null)
                .mapToDouble(RoomBooking::getPrice)
                .sum();
        List<TourRoomBooking> tourRoomBookings = tourRoomBookingRepository.findAll();
        totalIncome += tourRoomBookings.stream()
                .filter(tourRoomBooking -> tourRoomBooking.getPrice() != null)
                .mapToDouble(TourRoomBooking::getPrice)
                .sum();
        List<TourBooking> tourBookings = tourBookingRepository.findAll();
        totalIncome += tourBookings.stream()
                .filter(tourBooking -> tourBooking.getAmount() != null)
                .mapToDouble(TourBooking::getAmount)
                .sum();

        int quantityBookings = roomBookings.size() + tourRoomBookings.size() + tourBookings.size();

        List<Transaction> transactions = transactionRepository.findAll();
        int quantityTransactions = transactions.size();

        StatisticalResponseDto responseDto = new StatisticalResponseDto();

        responseDto.setQuantityUsers(quantityUsers);
        DecimalFormat df = new DecimalFormat("#.##");
        responseDto.setIncome(Double.valueOf(df.format(totalIncome)));
        responseDto.setQuantityBookings(quantityBookings);
        responseDto.setQuantityTransactions(quantityTransactions);

        return responseDto;
    }

}
