package com.example.city_tours.service;

import com.example.city_tours.dto.request.TourBooking.CreateTourBookingRequestDto;
import com.example.city_tours.dto.request.TourBooking.UpdateTourBookingRequestDto;
import com.example.city_tours.dto.request.TourRoomBooking.CreateTourRoomBookingRequestDto;
import com.example.city_tours.dto.response.Tour.GetAllToursResponseDto;
import com.example.city_tours.dto.response.TourBooking.CreateTourBookingResponseDto;
import com.example.city_tours.dto.response.TourBooking.GetAllTourBookingsByUserIdResponseDto;
import com.example.city_tours.dto.response.TourBooking.GetAllTourBookingsResponseDto;
import com.example.city_tours.dto.response.TourBooking.UpdateTourBookingResponseDto;
import com.example.city_tours.dto.response.TourRoomBooking.CreateTourRoomBookingResponseDto;
import com.example.city_tours.dto.response.User.PageResponseDto;
import com.example.city_tours.entity.*;
import com.example.city_tours.enums.ActiveStatus;
import com.example.city_tours.enums.BookingStatus;
import com.example.city_tours.enums.PaymentStatus;
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
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class TourBookingServiceImpl implements TourBookingService{

    private final TourRepository tourRepository;
    private final CustomerRepository customerRepository;
    private final TourBookingRepository tourBookingRepository;
    private final UserRepository userRepository;

    @Override
    public CreateTourBookingResponseDto createTourBooking(CreateTourBookingRequestDto requestDto) {

        Optional<Tour> optionalTour = tourRepository.findById(requestDto.getTourId());

        if (!optionalTour.isPresent()) {
            throw new ResourceNotFoundException("Tour not found");
        }

        Optional<User> optionalUser = userRepository.findById(requestDto.getUserId());

        if (!optionalUser.isPresent()) {
            throw new ResourceNotFoundException("Customer not found");
        }

        Customer customer = optionalUser.get().getCustomer();

        Tour tour = optionalTour.get();

        tour.setAdults(tour.getAdults() - requestDto.getAdults());
        tour.setChildren(tour.getChildren() - requestDto.getChildren());
        tour.setBaby(tour.getBaby() - requestDto.getBaby());
        tour.setQuantityCustomerBooking(tour.getQuantityCustomerBooking() + requestDto.getAdults() + requestDto.getChildren() + requestDto.getBaby());

        tourRepository.save(tour);

        TourBooking tourBooking = new TourBooking();

        tourBooking.setStartTime(requestDto.getStartTime());
        tourBooking.setAdults(requestDto.getAdults());
        tourBooking.setChildren(requestDto.getChildren());
        tourBooking.setBaby(requestDto.getBaby());
        tourBooking.setAmount(requestDto.getAmount());
        tourBooking.setBookingStatus(BookingStatus.valueOf(requestDto.getBookingStatus()));
        tourBooking.setCreatedAt(LocalDateTime.now());
        tourBooking.setUpdatedAt(LocalDateTime.now());
        tourBooking.setTour(optionalTour.get());
        tourBooking.setCustomer(customer);
        tourBooking.setReviewStatus(ReviewStatus.NOT_PROVIDED);
        tourBooking.setPaymentStatus(PaymentStatus.valueOf(requestDto.getPaymentStatus()));
        tourBooking.setCode(generateCode());

        TourBooking savedTourBooking = tourBookingRepository.save(tourBooking);

        CreateTourBookingResponseDto tourBookingResponseDto = new CreateTourBookingResponseDto();

        tourBookingResponseDto.setId(savedTourBooking.getId());
        tourBookingResponseDto.setStartTime(savedTourBooking.getStartTime());
        tourBookingResponseDto.setAdults(savedTourBooking.getAdults());
        tourBookingResponseDto.setChildren(savedTourBooking.getChildren());
        tourBookingResponseDto.setBaby(savedTourBooking.getBaby());
        tourBookingResponseDto.setAmount(savedTourBooking.getAmount());
        tourBookingResponseDto.setBookingStatus(savedTourBooking.getBookingStatus().toString());
        tourBookingResponseDto.setCreatedAt(savedTourBooking.getCreatedAt());
        tourBookingResponseDto.setTourId(savedTourBooking.getTour().getId());
        tourBookingResponseDto.setPaymentStatus(savedTourBooking.getPaymentStatus().toString());
        tourBookingResponseDto.setCode(savedTourBooking.getCode());

        return tourBookingResponseDto;
    }

    private String generateCode() {
        // Get current date and time
        LocalDateTime now = LocalDateTime.now();

        // Define a DateTimeFormatter for the desired format
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMddHHmmss");

        // Format the current date and time
        String formattedDateTime = now.format(formatter);

        // Return the generated code
        return "BOOK-" + formattedDateTime;
    }

    @Override
    public UpdateTourBookingResponseDto updateTourBooking(UpdateTourBookingRequestDto requestDto) {
        Optional<TourBooking> optionalTourBooking = tourBookingRepository.findById(requestDto.getTourBookingId());

        if (!optionalTourBooking.isPresent()) {
            throw new ResourceNotFoundException("Tour booking not found");
        }

        TourBooking tourBooking = optionalTourBooking.get();

        tourBooking.setBookingStatus(BookingStatus.valueOf(requestDto.getBookingStatus()));

        tourBookingRepository.save(tourBooking);

        UpdateTourBookingResponseDto responseDto = new UpdateTourBookingResponseDto();

        responseDto.setTourBookingId(tourBooking.getId());
        responseDto.setBookingStatus(tourBooking.getBookingStatus().toString());

        return responseDto;

    }

    @Override
    public PageResponseDto getAllTourBookings(int page, int limit, String tourName, Integer tourId) {
        // Fetch tours from the repository with pagination
        Pageable pageable = PageRequest.of(page - 1, limit);

        Specification<Tour> spec = (root, query, cb) -> {
            Predicate predicate = cb.conjunction(); // Start with an "AND" conjunction

            if (tourName != null && !tourName.isEmpty()) {
                Predicate tourNamePredicate = cb.like(cb.lower(root.get("tour").get("name")), "%" + tourName.toLowerCase() + "%");
                predicate = cb.and(predicate, tourNamePredicate);
            }

            if (tourId != null) {
                Predicate tourIdPredicate = cb.equal(root.get("tour").get("id"), tourId);
                predicate = cb.and(predicate, tourIdPredicate);
            }

            return predicate;
        };

        Page<TourBooking> tourBookingPage = tourBookingRepository.findAll(spec, pageable);

        long totalTourBookings = tourBookingPage.getTotalElements();

        // Retrieve the content from the fetched page
        List<TourBooking> tourBookings = tourBookingPage.getContent();

        // Check if the fetched list of users is empty
        if (tourBookings.isEmpty()) {
            throw new ResourceNotFoundException("No tour bookings found");
        }

        // Initialize the responseDtoList
        List<GetAllTourBookingsResponseDto> responseDtoList = new ArrayList<>();

        // Convert tours to GetAllAccountsResponseDto
        for (TourBooking tourBooking : tourBookings) {
            GetAllTourBookingsResponseDto responseDto = new GetAllTourBookingsResponseDto();
            responseDto.setId(tourBooking.getId());
            responseDto.setAdults(tourBooking.getAdults());
            responseDto.setChild(tourBooking.getChildren());
            responseDto.setBaby(tourBooking.getBaby());
            responseDto.setAmount(tourBooking.getAmount());
            responseDto.setBookingStatus(tourBooking.getBookingStatus().toString());
            responseDto.setTourId(tourBooking.getTour().getId());
            responseDto.setTourName(tourBooking.getTour().getName());
            responseDto.setCustomerId(tourBooking.getCustomer().getId());
            responseDto.setCustomerName(tourBooking.getCustomer().getName());
            responseDto.setCreatedAt(tourBooking.getCreatedAt());
            responseDto.setUpdatedAt(tourBooking.getUpdatedAt());
            responseDto.setPaymentStatus(tourBooking.getPaymentStatus().toString());
            responseDto.setCode(tourBooking.getCode());

            // Add responseDto to the list
            responseDtoList.add(responseDto);
        }

        int skip = (page - 1) * limit;

        // Prepare the response structure
        PageResponseDto<GetAllTourBookingsResponseDto> pageResponseDto = new PageResponseDto<>();
        pageResponseDto.setData(responseDtoList);
        pageResponseDto.setPage(page);
        pageResponseDto.setLimit(limit);
        pageResponseDto.setSkip(skip);
        pageResponseDto.setTotals(totalTourBookings);

        // Return the responseDtoList
        return pageResponseDto;
    }

    @Override
    public PageResponseDto getAllTourBookingsByUserId(Long userId, int page, int limit) {
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

        // Fetch tours from the repository with pagination
        Pageable pageable = PageRequest.of(page - 1, limit);

        Page<TourBooking> tourBookingPage = tourBookingRepository.findAllByCustomerId(customer.getId(), pageable);

        long totalTourBookings = tourBookingPage.getTotalElements();

        // Retrieve the content from the fetched page
        List<TourBooking> tourBookings = tourBookingPage.getContent();

        // Check if the fetched list of users is empty
        if (tourBookings.isEmpty()) {
            throw new ResourceNotFoundException("No tour bookings found");
        }

        // Initialize the responseDtoList
        List<GetAllTourBookingsByUserIdResponseDto> responseDtoList = new ArrayList<>();

        // Convert tours to GetAllAccountsResponseDto
        for (TourBooking tourBooking : tourBookings) {
            GetAllTourBookingsByUserIdResponseDto responseDto = new GetAllTourBookingsByUserIdResponseDto();
            responseDto.setId(tourBooking.getId());
            responseDto.setAdults(tourBooking.getAdults());
            responseDto.setChildren(tourBooking.getChildren());
            responseDto.setBaby(tourBooking.getBaby());
            responseDto.setAmount(tourBooking.getAmount());
            responseDto.setBookingStatus(tourBooking.getBookingStatus().toString());
            responseDto.setTourId(tourBooking.getTour().getId());
            responseDto.setTourName(tourBooking.getTour().getName());
            responseDto.setCustomerId(tourBooking.getCustomer().getId());
            responseDto.setCustomerName(tourBooking.getCustomer().getName());
            responseDto.setCreatedAt(tourBooking.getCreatedAt());
            responseDto.setUpdatedAt(tourBooking.getUpdatedAt());
            responseDto.setTourCode(tourBooking.getTour().getCode());
            responseDto.setThumbnail(tourBooking.getTour().getThumbnail());
            responseDto.setStartTime(tourBooking.getStartTime());
            responseDto.setPaymentStatus(tourBooking.getPaymentStatus().toString());
            responseDto.setCode(tourBooking.getCode());

            // Add responseDto to the list
            responseDtoList.add(responseDto);
        }

        int skip = (page - 1) * limit;

        // Prepare the response structure
        PageResponseDto<GetAllTourBookingsByUserIdResponseDto> pageResponseDto = new PageResponseDto<>();
        pageResponseDto.setData(responseDtoList);
        pageResponseDto.setPage(page);
        pageResponseDto.setLimit(limit);
        pageResponseDto.setSkip(skip);
        pageResponseDto.setTotals(totalTourBookings);

        // Return the responseDtoList
        return pageResponseDto;
    }

}
