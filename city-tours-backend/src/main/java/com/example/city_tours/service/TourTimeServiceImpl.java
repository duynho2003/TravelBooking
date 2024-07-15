package com.example.city_tours.service;

import com.example.city_tours.dto.request.User.CreateAccountRequestDto;
import com.example.city_tours.dto.request.User.UpdateAccountRequestDto;
import com.example.city_tours.dto.response.Customer.CreateCustomerResponseDto;
import com.example.city_tours.dto.response.RoomBooking.GetRoomBookingResponseDto;
import com.example.city_tours.dto.response.TourBooking.GetATourBookingResponseDto;
import com.example.city_tours.dto.response.User.CreateAccountResponseDto;
import com.example.city_tours.dto.response.User.GetAccountByIdResponseDto;
import com.example.city_tours.dto.response.User.GetAllAccountsResponseDto;
import com.example.city_tours.dto.response.User.UpdateAccountResponseDto;
import com.example.city_tours.entity.*;
import com.example.city_tours.enums.UserStatus;
import com.example.city_tours.exception.EmailAlreadyExistsException;
import com.example.city_tours.exception.ResourceNotFoundException;
import com.example.city_tours.exception.UsernameAlreadyExistsException;
import com.example.city_tours.repository.*;
import jakarta.persistence.criteria.Predicate;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class TourTimeServiceImpl implements TourTimeService{

    private final TourTimeRepository tourTimeRepository;
    private final TourRepository tourRepository;

    @Transactional
    @Override
    public void deleteTourTime(Long tourTimeId) {

        Optional<TourTime> optionalTourTime = tourTimeRepository.findById(tourTimeId);

        if (!optionalTourTime.isPresent()) {
            throw new ResourceNotFoundException("Tour time not found");
        }

        TourTime tourTime = optionalTourTime.get();

        Tour tour = tourTime.getTour();

        if (tour != null) {
            tour.getTourTimes().remove(tourTime);
            tourRepository.save(tour);
        }

        tourTimeRepository.delete(tourTime);

    }

}
