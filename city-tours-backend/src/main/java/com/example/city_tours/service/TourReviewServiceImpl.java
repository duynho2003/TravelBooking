package com.example.city_tours.service;

import com.example.city_tours.dto.request.HotelReview.CreateHotelReviewRequestDto;
import com.example.city_tours.dto.request.TourReview.CreateTourReviewRequestDto;
import com.example.city_tours.dto.response.HotelReview.CreateHotelReviewResponseDto;
import com.example.city_tours.dto.response.HotelReview.GetAllHotelReviewsResponseDto;
import com.example.city_tours.dto.response.TourReview.CreateTourReviewResponseDto;
import com.example.city_tours.dto.response.TourReview.GetAllTourReviewsResponseDto;
import com.example.city_tours.dto.response.User.PageResponseDto;
import com.example.city_tours.entity.*;
import com.example.city_tours.enums.ReviewStatus;
import com.example.city_tours.exception.ResourceNotFoundException;
import com.example.city_tours.repository.*;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class TourReviewServiceImpl implements TourReviewService{

    private final TourRepository tourRepository;
    private final UserRepository userRepository;
    private final TourReviewRepository tourReviewRepository;
    private final TourBookingRepository tourBookingRepository;

    @Override
    public CreateTourReviewResponseDto createTourReview(CreateTourReviewRequestDto requestDto) {
        Optional<Tour> optionalTour = tourRepository.findById(requestDto.getTourId());

        if (!optionalTour.isPresent()) {
            throw new ResourceNotFoundException("Tour not found");
        }

        Optional<User> optionalUser = userRepository.findById(requestDto.getUserId());

        if (!optionalUser.isPresent()) {
            throw new ResourceNotFoundException("Customer not found");
        }

        Customer customer = optionalUser.get().getCustomer();

        TourReview tourReview = new TourReview();

        tourReview.setCustomerName(requestDto.getCustomerName());
        tourReview.setContent(requestDto.getContent());
        tourReview.setRating(requestDto.getRating());
        tourReview.setCreatedAt(LocalDateTime.now());
        tourReview.setUpdatedAt(LocalDateTime.now());
        tourReview.setCustomer(customer);
        tourReview.setTour(optionalTour.get());

        TourReview savedTourReview = tourReviewRepository.save(tourReview);

        Optional<TourBooking> optionalTourBooking = tourBookingRepository.findById(requestDto.getTourBookingId());

        if (!optionalTourBooking.isPresent()) {
            throw new ResourceNotFoundException("Tour booking not found");
        }

        TourBooking tourBooking = optionalTourBooking.get();

        tourBooking.setReviewStatus(ReviewStatus.PROVIDED);

        tourBookingRepository.save(tourBooking);

        Tour tour = optionalTour.get();
        int numberOfRatings = tour.getNumberOfRating() + 1;
        double newRating = requestDto.getRating();

        double currentRating = tour.getRating();
        double updatedRating = calculateNewRating(currentRating, newRating, numberOfRatings);

        tour.setNumberOfRating(numberOfRatings);
        tour.setRating(updatedRating);

        tourRepository.save(tour);

        CreateTourReviewResponseDto responseDto = new CreateTourReviewResponseDto();

        responseDto.setCustomerName(savedTourReview.getCustomerName());
        responseDto.setId(savedTourReview.getId());
        responseDto.setContent(savedTourReview.getContent());
        responseDto.setRating(savedTourReview.getRating());
        responseDto.setCreatedAt(savedTourReview.getCreatedAt().toString());
        responseDto.setCustomerId(savedTourReview.getCustomer().getId());
        responseDto.setTourId(savedTourReview.getTour().getId());

        return responseDto;
    }

    private double calculateNewRating(double currentRating, double newRating, int numberOfRatings) {
        double totalRating = currentRating * (numberOfRatings - 1);
        totalRating += newRating;
        return totalRating / numberOfRatings;
    }

    @Override
    public PageResponseDto getAllTourReviews(int page, int limit) {

        Pageable pageable = PageRequest.of(page - 1, limit);

        Page<TourReview> tourReviewPage = tourReviewRepository.findAll(pageable);

        long totalTourReviews = tourReviewPage.getTotalElements();

        List<TourReview> tourReviews = tourReviewPage.getContent();

        if (tourReviews.isEmpty()) {
            throw new ResourceNotFoundException("No tour reviews found");
        }

        List<GetAllTourReviewsResponseDto> responseDtoList = new ArrayList<>();

        for (TourReview tourReview  : tourReviews) {
            GetAllTourReviewsResponseDto responseDto = new GetAllTourReviewsResponseDto();

            responseDto.setId(tourReview.getId());
            responseDto.setCustomerId(tourReview.getCustomer().getId());
            responseDto.setTourId(tourReview.getTour().getId());
            responseDto.setCustomerName(tourReview.getCustomerName());
            responseDto.setContent(tourReview.getContent());
            responseDto.setRating(tourReview.getRating());
            responseDto.setCreatedAt(tourReview.getCreatedAt());

            responseDtoList.add(responseDto);
        }

        int skip = (page - 1) * limit;

        PageResponseDto<GetAllTourReviewsResponseDto> pageResponseDto = new PageResponseDto<>();
        pageResponseDto.setData(responseDtoList);
        pageResponseDto.setPage(page);
        pageResponseDto.setLimit(limit);
        pageResponseDto.setSkip(skip);
        pageResponseDto.setTotals(totalTourReviews);

        return pageResponseDto;
    }


    @Override
    public PageResponseDto getTourReviewsByTourId(Long tourId, int page, int limit) {

        Pageable pageable = PageRequest.of(page - 1, limit);

        Page<TourReview> tourReviewPage = tourReviewRepository.findByTourId(tourId, pageable);

        long totalTourReviews = tourReviewPage.getTotalElements();

        List<TourReview> tourReviews = tourReviewPage.getContent();

        if (tourReviews.isEmpty()) {
            throw new ResourceNotFoundException("No tour reviews found");
        }

        List<GetAllTourReviewsResponseDto> responseDtoList = new ArrayList<>();

        for (TourReview tourReview  : tourReviews) {
            GetAllTourReviewsResponseDto responseDto = new GetAllTourReviewsResponseDto();

            responseDto.setId(tourReview.getId());
            responseDto.setCustomerId(tourReview.getCustomer().getId());
            responseDto.setTourId(tourReview.getTour().getId());
            responseDto.setCustomerName(tourReview.getCustomerName());
            responseDto.setContent(tourReview.getContent());
            responseDto.setRating(tourReview.getRating());
            responseDto.setCreatedAt(tourReview.getCreatedAt());

            responseDtoList.add(responseDto);
        }

        int skip = (page - 1) * limit;

        PageResponseDto<GetAllTourReviewsResponseDto> pageResponseDto = new PageResponseDto<>();
        pageResponseDto.setData(responseDtoList);
        pageResponseDto.setPage(page);
        pageResponseDto.setLimit(limit);
        pageResponseDto.setSkip(skip);
        pageResponseDto.setTotals(totalTourReviews);

        return pageResponseDto;
    }

}
