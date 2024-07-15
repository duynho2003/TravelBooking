package com.example.city_tours.service;

import com.example.city_tours.dto.request.Tour.CreateTourRequestDto;
import com.example.city_tours.dto.request.Tour.UpdateTourRequestDto;
import com.example.city_tours.dto.request.TourLocation.CreateTourLocationRequestDto;
import com.example.city_tours.dto.request.TourLocation.UpdateTourLocationRequestDto;
import com.example.city_tours.dto.request.TourTime.CreateTourTimeRequestDto;
import com.example.city_tours.dto.request.TourTime.UpdateTourTimeRequestDto;
import com.example.city_tours.dto.response.Tour.CreateTourResponseDto;
import com.example.city_tours.dto.response.Tour.GetAllToursResponseDto;
import com.example.city_tours.dto.response.Tour.GetTourByIdResponseDto;
import com.example.city_tours.dto.response.Tour.UpdateTourResponseDto;
import com.example.city_tours.dto.response.TourLocation.GetATourLocationResponseDto;
import com.example.city_tours.dto.response.TourTime.GetATourTimeResponseDto;
import com.example.city_tours.dto.response.User.PageResponseDto;
import com.example.city_tours.entity.*;
import com.example.city_tours.enums.ActiveStatus;
import com.example.city_tours.enums.BookedStatus;
import com.example.city_tours.exception.ResourceCanNotBeDeletedException;
import com.example.city_tours.exception.ResourceNotFoundException;
import com.example.city_tours.repository.*;
import jakarta.persistence.criteria.Predicate;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
@AllArgsConstructor
public class TourServiceImpl implements TourService{

    private final TourRepository tourRepository;
    private final TourTimeRepository tourTimeRepository;
    private final TourLocationRepository tourLocationRepository;
    private final TourBookingRepository tourBookingRepository;

    @Override
    public CreateTourResponseDto createTour(CreateTourRequestDto requestDto) {

        Tour tour = new Tour();
        tour.setCode(requestDto.getCode());
        tour.setName(requestDto.getName());
        tour.setDescription(requestDto.getDescription());
        tour.setDetail(requestDto.getDetail());
        tour.setRating(0.0);
        tour.setNumberOfRating(0);
        tour.setPrice(requestDto.getPrice());
        tour.setDiscount(requestDto.getDiscount());
        tour.setLocations(requestDto.getLocations());
        tour.setDepart(requestDto.getDepart());
        tour.setAdults(requestDto.getAdults());
        tour.setChildren(requestDto.getChildren());
        tour.setBaby(requestDto.getBaby());
        tour.setThumbnail(requestDto.getThumbnail());
        tour.setBookedStatus(BookedStatus.NOT_BOOKED);
        tour.setActiveStatus(ActiveStatus.ACTIVE);
        tour.setCreatedAt(LocalDateTime.now());
        tour.setUpdatedAt(LocalDateTime.now());

        Tour savedTour = tourRepository.save(tour);

        Set<TourTime> tourTimes = new HashSet<>();

        for (CreateTourTimeRequestDto tourTimeRequestDto : requestDto.getTourTimes()) {
            TourTime savedTourTime = new TourTime();

            savedTourTime.setStartDate(tourTimeRequestDto.getStartDate());
            savedTourTime.setEndDate(tourTimeRequestDto.getEndDate());
            savedTourTime.setTour(savedTour);

            tourTimes.add(savedTourTime);
        }

        tourTimeRepository.saveAll(tourTimes);

        savedTour.setTourTimes(tourTimes);

        Set<TourLocation> tourLocations = new HashSet<>();

        for (CreateTourLocationRequestDto tourLocationRequestDto : requestDto.getTourLocations()) {
            TourLocation savedTourLocation = new TourLocation();

            savedTourLocation.setStartPoint(tourLocationRequestDto.getStartPoint());
            savedTourLocation.setEndPoint(tourLocationRequestDto.getEndPoint());
            savedTourLocation.setCoordinatesStartPoint(tourLocationRequestDto.getCoordinatesStartPoint());
            savedTourLocation.setCoordinatesEndPoint(tourLocationRequestDto.getCoordinatesEndPoint());
            savedTourLocation.setTour(savedTour);

            tourLocations.add(savedTourLocation);
        }

        tourLocationRepository.saveAll(tourLocations);

        savedTour.setTourLocations(tourLocations);

        Tour updatedTour = tourRepository.save(savedTour);

        CreateTourResponseDto tourResponseDto = new CreateTourResponseDto();

        tourResponseDto.setId(updatedTour.getId());
        tourResponseDto.setCode(updatedTour.getCode());
        tourResponseDto.setName(updatedTour.getName());
        tourResponseDto.setDescription(updatedTour.getDescription());
        tourResponseDto.setDepart(updatedTour.getDepart());
        tourResponseDto.setAdults(updatedTour.getAdults());
        tourResponseDto.setChildren(updatedTour.getChildren());
        tourResponseDto.setBaby(updatedTour.getBaby());
        tourResponseDto.setRating(updatedTour.getRating());
        tourResponseDto.setNumberOfRating(updatedTour.getNumberOfRating());
        tourResponseDto.setPrice(updatedTour.getPrice());
        tourResponseDto.setDiscount(updatedTour.getDiscount());
        tourResponseDto.setLocations(updatedTour.getLocations());
        tourResponseDto.setThumbnail(updatedTour.getThumbnail());
        tourResponseDto.setBookedStatus(updatedTour.getBookedStatus().toString());
        tourResponseDto.setActiveStatus(updatedTour.getActiveStatus().toString());
        tourResponseDto.setCreatedAt(updatedTour.getCreatedAt());

        return tourResponseDto;
    }

    @Override
    public UpdateTourResponseDto updateTour(Long tourId, UpdateTourRequestDto requestDto) {

        Optional<Tour> optionalTour = tourRepository.findById(tourId);

        if (!optionalTour.isPresent()) {
            throw new ResourceNotFoundException("Tour not found");
        }

        Tour tour = optionalTour.get();

        tour.setName(requestDto.getName());
        tour.setDescription(requestDto.getDescription());
        tour.setDetail(requestDto.getDetail());
        tour.setDepart(requestDto.getDepart());
        tour.setPrice(requestDto.getPrice());
        tour.setDiscount(requestDto.getDiscount());
        tour.setLocations(requestDto.getLocations());
        tour.setAdults(requestDto.getAdults());
        tour.setChildren(requestDto.getChildren());
        tour.setBaby(requestDto.getBaby());
        tour.setBookedStatus(BookedStatus.valueOf(requestDto.getBookedStatus()));
        tour.setActiveStatus(ActiveStatus.valueOf(requestDto.getActiveStatus()));
        tour.setThumbnail(requestDto.getThumbnail());
        tour.setUpdatedAt(LocalDateTime.now());

        Set<UpdateTourTimeRequestDto> tourTimeRequests = requestDto.getTourTimes();
        Set<TourTime> existingTourTimes = tour.getTourTimes();

        for (UpdateTourTimeRequestDto tourTimeRequest : tourTimeRequests) {
            if (tourTimeRequest.getId() != null) {
                boolean found = false;

                for (TourTime existingTourTime : existingTourTimes) {
                    if (existingTourTime.getId() != null && existingTourTime.getId().equals(tourTimeRequest.getId())) {
                        existingTourTime.setStartDate(tourTimeRequest.getStartDate());
                        existingTourTime.setEndDate(tourTimeRequest.getEndDate());
                        found = true;
                        break;
                    }
                }

                if (!found) {
                    throw new ResourceNotFoundException("TourTime not found");
                }

            } else {
                TourTime newTourTime = new TourTime();
                newTourTime.setStartDate(tourTimeRequest.getStartDate());
                newTourTime.setEndDate(tourTimeRequest.getEndDate());
                newTourTime.setTour(tour);
                existingTourTimes.add(newTourTime);
            }
        }

        Set<UpdateTourLocationRequestDto> tourLocationRequests = requestDto.getTourLocations();
        Set<TourLocation> existingTourLocations = tour.getTourLocations();

        for (UpdateTourLocationRequestDto tourLocationRequest : tourLocationRequests) {
            if (tourLocationRequest.getId() != null) {
                boolean found = false;

                for (TourLocation existingTourLocation : existingTourLocations) {
                    if (existingTourLocation.getId() != null && existingTourLocation.getId().equals(tourLocationRequest.getId())) {
                        existingTourLocation.setStartPoint(tourLocationRequest.getStartPoint());
                        existingTourLocation.setEndPoint(tourLocationRequest.getEndPoint());
                        existingTourLocation.setCoordinatesStartPoint(tourLocationRequest.getCoordinatesStartPoint());
                        existingTourLocation.setCoordinatesEndPoint(tourLocationRequest.getCoordinatesEndPoint());
                        found = true;
                        break;
                    }
                }

                if (!found) {
                    throw new ResourceNotFoundException("Tour locations not found");
                }
            } else {
                TourLocation newTourLocation = new TourLocation();
                newTourLocation.setStartPoint(tourLocationRequest.getStartPoint());
                newTourLocation.setEndPoint(tourLocationRequest.getEndPoint());
                newTourLocation.setCoordinatesStartPoint(tourLocationRequest.getCoordinatesStartPoint());
                newTourLocation.setCoordinatesEndPoint(tourLocationRequest.getCoordinatesEndPoint());
                newTourLocation.setTour(tour);
                existingTourLocations.add(newTourLocation);
            }
        }

        Tour updatedTour = tourRepository.save(tour);

        UpdateTourResponseDto tourResponseDto = new UpdateTourResponseDto();

        tourResponseDto.setId(updatedTour.getId());
        tourResponseDto.setName(updatedTour.getName());
        tourResponseDto.setDescription(updatedTour.getDescription());
        tourResponseDto.setDepart(updatedTour.getDepart());
        tourResponseDto.setRating(updatedTour.getRating());
        tourResponseDto.setNumberOfRating(updatedTour.getNumberOfRating());
        tourResponseDto.setPrice(updatedTour.getPrice());
        tourResponseDto.setDiscount(updatedTour.getDiscount());
        tourResponseDto.setLocations(updatedTour.getLocations());
        tourResponseDto.setAdults(updatedTour.getAdults());
        tourResponseDto.setChildren(updatedTour.getChildren());
        tourResponseDto.setBaby(updatedTour.getBaby());
        tourResponseDto.setBookedStatus(updatedTour.getBookedStatus().toString());
        tourResponseDto.setActiveStatus(updatedTour.getActiveStatus().toString());
        tourResponseDto.setThumbnail(updatedTour.getThumbnail());

        return tourResponseDto;
    }

    @Override
    public void deleteTour(Long tourId) {

        Optional<Tour> optionalTour = tourRepository.findById(tourId);

        if (!optionalTour.isPresent()) {
            throw new ResourceNotFoundException("Tour not found");
        }

        Tour tour = optionalTour.get();

        if (tourBookingRepository.existsByTourId(tourId)) {
            throw new ResourceCanNotBeDeletedException("Tour has been booked and cannot be deleted");
        }

        for (TourTime tourTime : tour.getTourTimes()) {
            tourTimeRepository.deleteById(tourTime.getId());
        }

        for (TourLocation tourLocation : tour.getTourLocations()) {
            tourLocationRepository.deleteById(tourLocation.getId());
        }

        tourRepository.deleteById(tourId);

    }

    @Override
    public PageResponseDto getAllTours(int page, int limit, String search, String date, String status, Double startPrice, Double endPrice, String review, String rating) {
        Specification<Tour> spec = (root, query, cb) -> {
            Predicate predicate = cb.conjunction(); // Start with an "AND" conjunction

            // Add condition to search for username or email if search parameter is provided
            if (search != null && !search.isEmpty()) {
                Predicate namePredicate = cb.like(cb.lower(root.get("name")), "%" + search.toLowerCase() + "%");
                predicate = cb.or(namePredicate);
            }

            // Add condition to filter by role if role parameter is provided
            if (date != null && !date.isEmpty()) {
                predicate = cb.and(predicate, cb.equal(root.join("schedules").get("date"), date));
            }

            // Add condition to filter by status if status parameter is provided
            if (status != null && !status.isEmpty()) {
                predicate = cb.and(predicate, cb.equal(root.get("activeStatus"), ActiveStatus.valueOf(status.toUpperCase())));
            }

            // Add condition to filter by price range if startPrice and endPrice parameters are provided
            if (startPrice != null && endPrice != null) {
                predicate = cb.and(predicate, cb.between(root.get("price"), startPrice, endPrice));
            }

            // Add condition to search for username or email if search parameter is provided
            if (review != null && !review.isEmpty()) {
                double reviewValue = Double.parseDouble(review);
                double upperReviewValue = reviewValue + 0.9;
                Predicate ratingPredicate = cb.between(root.get("rating").as(Double.class), reviewValue, upperReviewValue);
                predicate = cb.and(predicate, ratingPredicate);
            }

            return predicate;
        };

        Sort sort = Sort.unsorted();
        if ("increment".equalsIgnoreCase(rating)) {
            sort = Sort.by("rating").descending();
        } else if ("decrement".equalsIgnoreCase(rating)) {
            sort = Sort.by("rating").ascending();
        }

        // Fetch tours from the repository with pagination
        Pageable pageable = PageRequest.of(page - 1, limit, sort);

        Page<Tour> tourPage = tourRepository.findAll(spec, pageable);

        // Retrieve the total number of tours
        long totalTours = tourPage.getTotalElements();

        // Retrieve the content from the fetched page
        List<Tour> tours = tourPage.getContent();

        // Check if the fetched list of users is empty
        if (tours.isEmpty()) {
            throw new ResourceNotFoundException("No tours found");
        }

        // Initialize the responseDtoList
        List<GetAllToursResponseDto> responseDtoList = new ArrayList<>();

        // Convert tours to GetAllAccountsResponseDto
        for (Tour tour : tours) {
            GetAllToursResponseDto responseDto = new GetAllToursResponseDto();
            responseDto.setId(tour.getId());
            responseDto.setCode(tour.getCode());
            responseDto.setName(tour.getName());
            responseDto.setDescription(tour.getDescription());
            responseDto.setRating(tour.getRating());
            responseDto.setNumberOfRating(tour.getNumberOfRating());
            responseDto.setPrice(tour.getPrice());
            responseDto.setDiscount(tour.getDiscount());
            responseDto.setDepart(tour.getDepart());
            responseDto.setAdults(tour.getAdults());
            responseDto.setChild(tour.getChildren());
            responseDto.setBaby(tour.getBaby());
            responseDto.setLocations(tour.getLocations());
            responseDto.setThumbnail(tour.getThumbnail());
            responseDto.setBookedStatus(tour.getBookedStatus().toString());
            responseDto.setActiveStatus(tour.getActiveStatus().toString());
            responseDto.setCreatedAt(tour.getCreatedAt());
            responseDto.setUpdateAt(tour.getUpdatedAt());

            List<GetATourTimeResponseDto> tourTimeResponseDtos = new ArrayList<>();

            for (TourTime tourTime : tour.getTourTimes()) {
                GetATourTimeResponseDto tourTimeResponseDto = new GetATourTimeResponseDto();

                tourTimeResponseDto.setId(tourTime.getId());
                tourTimeResponseDto.setStartDate(tourTime.getStartDate());
                tourTimeResponseDto.setEndDate(tourTime.getEndDate());

                tourTimeResponseDtos.add(tourTimeResponseDto);
            }

            responseDto.setTourTimes(tourTimeResponseDtos);

            List<GetATourLocationResponseDto> tourLocationResponseDtos = new ArrayList<>();

            for (TourLocation tourLocation : tour.getTourLocations()) {
                GetATourLocationResponseDto tourLocationResponseDto = new GetATourLocationResponseDto();

                tourLocationResponseDto.setId(tourLocation.getId());
                tourLocationResponseDto.setStartPoint(tourLocation.getStartPoint());
                tourLocationResponseDto.setEndPoint(tourLocation.getEndPoint());

                tourLocationResponseDtos.add(tourLocationResponseDto);
            }

            responseDto.setTourLocations(tourLocationResponseDtos);

            // Add responseDto to the list
            responseDtoList.add(responseDto);
        }

        // Calculate skip (number of records skipped)
        int skip = (page - 1) * limit;

        // Prepare the response structure
        PageResponseDto<GetAllToursResponseDto> pageResponseDto = new PageResponseDto<>();
        pageResponseDto.setData(responseDtoList);
        pageResponseDto.setPage(page);
        pageResponseDto.setLimit(limit);
        pageResponseDto.setSkip(skip);
        pageResponseDto.setTotals(totalTours);

        // Return the responseDtoList
        return pageResponseDto;
    }

    @Override
    public GetTourByIdResponseDto getTourById(Long tourId) {
        Optional<Tour> tourOptional = tourRepository.findById(tourId);

        if (!tourOptional.isPresent()) {
            throw new ResourceNotFoundException("Tour not found");
        }

        Tour tour = tourOptional.get();

        GetTourByIdResponseDto responseDto = new GetTourByIdResponseDto();
        responseDto.setId(tour.getId());
        responseDto.setCode(tour.getCode());
        responseDto.setName(tour.getName());
        responseDto.setDescription(tour.getDescription());
        responseDto.setDetail(tour.getDetail());
        responseDto.setDepart(tour.getDepart());
        responseDto.setPrice(tour.getPrice());
        responseDto.setDiscount(tour.getDiscount());
        responseDto.setLocations(tour.getLocations());
        responseDto.setThumbnail(tour.getThumbnail());
        responseDto.setRating(tour.getRating());
        responseDto.setNumberOfRating(tour.getNumberOfRating());
        responseDto.setAdults(tour.getAdults());
        responseDto.setChildren(tour.getChildren());
        responseDto.setBaby(tour.getBaby());
        responseDto.setBookedStatus(tour.getBookedStatus().toString());
        responseDto.setActiveStatus(tour.getActiveStatus().toString());
        responseDto.setCreatedAt(tour.getCreatedAt());
        responseDto.setUpdatedAt(tour.getUpdatedAt());

        List<GetATourTimeResponseDto> tourTimeResponseDtos = new ArrayList<>();

        for (TourTime tourTime : tour.getTourTimes()) {
            GetATourTimeResponseDto tourTimeResponseDto = new GetATourTimeResponseDto();

            tourTimeResponseDto.setId(tourTime.getId());
            tourTimeResponseDto.setStartDate(tourTime.getStartDate());
            tourTimeResponseDto.setEndDate(tourTime.getEndDate());

            tourTimeResponseDtos.add(tourTimeResponseDto);
        }

        tourTimeResponseDtos.sort(Comparator.comparing(GetATourTimeResponseDto::getId));

        responseDto.setTourTimes(tourTimeResponseDtos);

        List<GetATourLocationResponseDto> tourLocationResponseDtos = new ArrayList<>();

        for (TourLocation tourLocation : tour.getTourLocations()) {
            GetATourLocationResponseDto tourLocationResponseDto = new GetATourLocationResponseDto();

            tourLocationResponseDto.setId(tourLocation.getId());
            tourLocationResponseDto.setStartPoint(tourLocation.getStartPoint());
            tourLocationResponseDto.setEndPoint(tourLocation.getEndPoint());
            tourLocationResponseDto.setCoordinatesStartPoint(tourLocation.getCoordinatesStartPoint());
            tourLocationResponseDto.setCoordinatesEndPoint(tourLocation.getCoordinatesEndPoint());

            tourLocationResponseDtos.add(tourLocationResponseDto);
        }

        tourLocationResponseDtos.sort(Comparator.comparing(GetATourLocationResponseDto::getId));

        responseDto.setTourLocations(tourLocationResponseDtos);

        return responseDto;
    }

}
