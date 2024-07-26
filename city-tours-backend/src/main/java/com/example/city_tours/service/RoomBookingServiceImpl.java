package com.example.city_tours.service;

import com.example.city_tours.dto.request.RoomBooking.CreateRoomBookingRequestDto;
import com.example.city_tours.dto.request.TourRoomBooking.CreateTourRoomBookingRequestDto;
import com.example.city_tours.dto.response.RoomBooking.CreateRoomBookingResponseDto;
import com.example.city_tours.dto.response.RoomBooking.GetRoomBookingResponseDto;
import com.example.city_tours.dto.response.RoomBooking.GetRoomBookingsByUserIdResponseDto;
import com.example.city_tours.dto.response.Tour.GetAllToursResponseDto;
import com.example.city_tours.dto.response.TourRoomBooking.CreateTourRoomBookingResponseDto;
import com.example.city_tours.dto.response.User.PageResponseDto;
import com.example.city_tours.entity.*;
import com.example.city_tours.enums.ActiveStatus;
import com.example.city_tours.enums.ReviewStatus;
import com.example.city_tours.exception.ResourceNotFoundException;
import com.example.city_tours.repository.*;
import jakarta.persistence.criteria.Predicate;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class RoomBookingServiceImpl implements RoomBookingService{

    private final TourRepository tourRepository;
    private final TourRoomBookingRepository tourRoomBookingRepository;
    private final RoomRepository roomRepository;
    private final CustomerRepository customerRepository;
    private final RoomBookingRepository roomBookingRepository;
    private final UserRepository userRepository;
    private final TourBookingRepository tourBookingRepository;

    @Override
    public CreateRoomBookingResponseDto createRoomBooking(CreateRoomBookingRequestDto requestDto) {
        Optional<Room> optionalRoom = roomRepository.findById(requestDto.getRoomId());

        if (!optionalRoom.isPresent()) {
            throw new ResourceNotFoundException("Room not found");
        }

        Optional<User> optionalUser = userRepository.findById(requestDto.getUserId());

        if (!optionalUser.isPresent()) {
            throw new ResourceNotFoundException("Customer not found");
        }

        Customer customer = optionalUser.get().getCustomer();

        RoomBooking roomBooking = new RoomBooking();

        roomBooking.setStartDate(requestDto.getStartDate());
        roomBooking.setEndDate(requestDto.getEndDate());
        roomBooking.setPrice(requestDto.getPrice());
        roomBooking.setReviewStatus(ReviewStatus.NOT_PROVIDED);
        roomBooking.setRoomType(requestDto.getRoomType());
        roomBooking.setRoomNumber(requestDto.getRoomNumber());
        roomBooking.setCreatedAt(LocalDateTime.now());
        roomBooking.setUpdatedAt(LocalDateTime.now());
        roomBooking.setCustomer(customer);
        roomBooking.setRoom(optionalRoom.get());

        RoomBooking savedRoomBooking = roomBookingRepository.save(roomBooking);

        CreateRoomBookingResponseDto responseDto = new CreateRoomBookingResponseDto();

        responseDto.setId(savedRoomBooking.getId());
        responseDto.setStartDate(savedRoomBooking.getStartDate());
        responseDto.setEndDate(savedRoomBooking.getEndDate());
        responseDto.setPrice(savedRoomBooking.getPrice());
        responseDto.setReviewStatus(savedRoomBooking.getReviewStatus().toString());
        responseDto.setRoomType(savedRoomBooking.getRoomType());
        responseDto.setCreatedAt(savedRoomBooking.getCreatedAt().toString());
        responseDto.setCustomerId(savedRoomBooking.getCustomer().getId());
        responseDto.setRoomId(savedRoomBooking.getRoom().getId());

        return responseDto;
    }

    @Override
    public PageResponseDto getAllRoomBookings(int page, int limit) {

        // Fetch tours from the repository with pagination
        Pageable pageable = PageRequest.of(page - 1, limit);

        Page<RoomBooking> roomBookingPage = roomBookingRepository.findAll(pageable);

        // Retrieve the total number of tours
        long totalRoomBookings = roomBookingPage.getTotalElements();

        // Retrieve the content from the fetched page
        List<RoomBooking> roomBookings = roomBookingPage.getContent();

        // Check if the fetched list of users is empty
        if (roomBookings.isEmpty()) {
            throw new ResourceNotFoundException("No room bookings found");
        }

        // Initialize the responseDtoList
        List<GetRoomBookingResponseDto> responseDtoList = new ArrayList<>();

        // Convert tours to GetAllAccountsResponseDto
        for (RoomBooking roomBooking : roomBookings) {
            GetRoomBookingResponseDto responseDto = new GetRoomBookingResponseDto();
            responseDto.setId(roomBooking.getId());
            responseDto.setStartDate(roomBooking.getStartDate());
            responseDto.setEndDate(roomBooking.getEndDate());
            responseDto.setPrice(roomBooking.getPrice());
            responseDto.setReviewStatus(roomBooking.getReviewStatus().toString());
            responseDto.setRoomType(roomBooking.getRoomType());
//            responseDto.setCustomerId(roomBooking.getCustomer().getId());
            responseDto.setRoomId(roomBooking.getRoom().getId());
            responseDto.setCreatedAt(roomBooking.getCreatedAt());
            responseDto.setUpdatedAt(roomBooking.getUpdatedAt());

            // Add responseDto to the list
            responseDtoList.add(responseDto);
        }

        // Calculate skip (number of records skipped)
        int skip = (page - 1) * limit;

        // Prepare the response structure
        PageResponseDto<GetRoomBookingResponseDto> pageResponseDto = new PageResponseDto<>();
        pageResponseDto.setData(responseDtoList);
        pageResponseDto.setPage(page);
        pageResponseDto.setLimit(limit);
        pageResponseDto.setSkip(skip);
        pageResponseDto.setTotals(totalRoomBookings);

        // Return the responseDtoList
        return pageResponseDto;
    }

    @Override
    public PageResponseDto getRoomBookingsByUserId(Long userId, int page, int limit) {
        Optional<User> optionalUser = userRepository.findById(userId);

        if (!optionalUser.isPresent()) {
            throw new ResourceNotFoundException("User not found");
        }

        User user = optionalUser.get();

        Optional<Customer> optionalCustomer = customerRepository.findById(user.getCustomer().getId());

        if (!optionalCustomer.isPresent()) {
            throw new ResourceNotFoundException("Customer not found");
        }

        Customer customer = optionalCustomer.get();

        Pageable pageable = PageRequest.of(page - 1, limit);

        Page<RoomBooking> roomBookingPage = roomBookingRepository.findAllByCustomerId(customer.getId(), pageable);

        // Retrieve the total number of tours
        long totalRoomBookings = roomBookingPage.getTotalElements();

        // Retrieve the content from the fetched page
        List<RoomBooking> roomBookings = roomBookingPage.getContent();

        // Check if the fetched list of users is empty
        if (roomBookings.isEmpty()) {
            throw new ResourceNotFoundException("No room bookings found");
        }

        // Initialize the responseDtoList
        List<GetRoomBookingResponseDto> responseDtoList = new ArrayList<>();

        // Convert tours to GetAllAccountsResponseDto
        for (RoomBooking roomBooking : roomBookings) {
            GetRoomBookingResponseDto responseDto = new GetRoomBookingResponseDto();
            responseDto.setId(roomBooking.getId());
            responseDto.setStartDate(roomBooking.getStartDate());
            responseDto.setEndDate(roomBooking.getEndDate());
            responseDto.setPrice(roomBooking.getPrice());
            responseDto.setReviewStatus(roomBooking.getReviewStatus().toString());
            responseDto.setRoomType(roomBooking.getRoomType());
            responseDto.setRoomNumber(roomBooking.getRoom().getRoomNumber());
            String hotelName = roomBooking.getRoom().getHotels()
                    .stream()
                    .findFirst()
                    .map(Hotel::getName)
                    .orElse("Unknown Hotel");
            responseDto.setHotelName(hotelName);
            responseDto.setCustomerId(roomBooking.getCustomer().getId());
            responseDto.setRoomId(roomBooking.getRoom().getId());
            responseDto.setCreatedAt(roomBooking.getCreatedAt());
            responseDto.setUpdatedAt(roomBooking.getUpdatedAt());

            // Add responseDto to the list
            responseDtoList.add(responseDto);
        }

        // Calculate skip (number of records skipped)
        int skip = (page - 1) * limit;

        // Prepare the response structure
        PageResponseDto<GetRoomBookingResponseDto> pageResponseDto = new PageResponseDto<>();
        pageResponseDto.setData(responseDtoList);
        pageResponseDto.setPage(page);
        pageResponseDto.setLimit(limit);
        pageResponseDto.setSkip(skip);
        pageResponseDto.setTotals(totalRoomBookings);

        // Return the responseDtoList
        return pageResponseDto;
    }

}
