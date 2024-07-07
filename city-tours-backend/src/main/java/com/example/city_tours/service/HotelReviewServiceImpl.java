package com.example.city_tours.service;

import com.example.city_tours.dto.request.HotelReview.CreateHotelReviewRequestDto;
import com.example.city_tours.dto.request.RoomBooking.CreateRoomBookingRequestDto;
import com.example.city_tours.dto.response.HotelReview.CreateHotelReviewResponseDto;
import com.example.city_tours.dto.response.HotelReview.GetAllHotelReviewsResponseDto;
import com.example.city_tours.dto.response.RoomBooking.CreateRoomBookingResponseDto;
import com.example.city_tours.dto.response.Tour.GetAllToursResponseDto;
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
public class HotelReviewServiceImpl implements HotelReviewService{

    private final TourRepository tourRepository;
    private final ScheduleRepository scheduleRepository;
    private final TourRoomBookingRepository tourRoomBookingRepository;
    private final RoomRepository roomRepository;
    private final CustomerRepository customerRepository;
    private final RoomBookingRepository roomBookingRepository;
    private final UserRepository userRepository;
    private final HotelRepository hotelRepository;
    private final HotelReviewRepository hotelReviewRepository;

    @Override
    public CreateHotelReviewResponseDto createHotelReview(CreateHotelReviewRequestDto requestDto) {
        Optional<Hotel> optionalHotel = hotelRepository.findById(requestDto.getHotelId());

        if (!optionalHotel.isPresent()) {
            throw new ResourceNotFoundException("Hotel not found");
        }

        Optional<User> optionalUser = userRepository.findById(requestDto.getUserId());

        if (!optionalUser.isPresent()) {
            throw new ResourceNotFoundException("Customer not found");
        }

        Customer customer = optionalUser.get().getCustomer();

        HotelReview hotelReview = new HotelReview();

        hotelReview.setCustomerName(requestDto.getCustomerName());
        hotelReview.setContent(requestDto.getContent());
        hotelReview.setRating(requestDto.getRating());
        hotelReview.setCreatedAt(LocalDateTime.now());
        hotelReview.setUpdatedAt(LocalDateTime.now());
        hotelReview.setCustomer(customer);
        hotelReview.setHotel(optionalHotel.get());

        HotelReview savedHotelReview = hotelReviewRepository.save(hotelReview);

        Hotel hotel = savedHotelReview.getHotel();

        hotel.getRating();

        int currentNumberOfRatings = hotel.getNumberOfRating();
        hotel.setNumberOfRating(currentNumberOfRatings + 1);

        double currentRating = hotel.getRating();
        double newRating = calculateNewRating(currentRating, savedHotelReview.getRating(), hotel.getNumberOfRating());
        hotel.setRating(newRating);

        hotelRepository.save(hotel);

        Optional<RoomBooking> optionalRoomBooking = roomBookingRepository.findById(requestDto.getRoomBookingId());

        if (!optionalRoomBooking.isPresent()) {
            throw new ResourceNotFoundException("Room booking not found");
        }

        RoomBooking roomBooking = optionalRoomBooking.get();

        roomBooking.setReviewStatus(ReviewStatus.PROVIDED);

        roomBookingRepository.save(roomBooking);

        CreateHotelReviewResponseDto responseDto = new CreateHotelReviewResponseDto();

        responseDto.setCustomerName(savedHotelReview.getCustomerName());
        responseDto.setId(savedHotelReview.getId());
        responseDto.setContent(savedHotelReview.getContent());
        responseDto.setRating(savedHotelReview.getRating());
        responseDto.setCreatedAt(savedHotelReview.getCreatedAt().toString());
        responseDto.setCustomerId(savedHotelReview.getCustomer().getId());
        responseDto.setHotelId(savedHotelReview.getHotel().getId());

        return responseDto;
    }

    private double calculateNewRating(double currentRating, double newRating, int numberOfRatings) {
        double totalRating = currentRating * (numberOfRatings - 1);
        totalRating += newRating;
        return totalRating / numberOfRatings;
    }

    @Override
    public PageResponseDto getAllHotelReviews(int page, int limit) {

        // Fetch tours from the repository with pagination
        Pageable pageable = PageRequest.of(page - 1, limit);

        Page<HotelReview> hotelReviewPage = hotelReviewRepository.findAll(pageable);

        // Retrieve the total number of tours
        long totalHotelReviews = hotelReviewPage.getTotalElements();

        // Retrieve the content from the fetched page
        List<HotelReview> hotelReviews = hotelReviewPage.getContent();

        // Check if the fetched list of users is empty
        if (hotelReviews.isEmpty()) {
            throw new ResourceNotFoundException("No hotel reviews found");
        }

        // Initialize the responseDtoList
        List<GetAllHotelReviewsResponseDto> responseDtoList = new ArrayList<>();

        // Convert tours to GetAllAccountsResponseDto
        for (HotelReview hotelReview  : hotelReviews) {
            GetAllHotelReviewsResponseDto responseDto = new GetAllHotelReviewsResponseDto();

            responseDto.setId(hotelReview.getId());
            responseDto.setCustomerId(hotelReview.getCustomer().getId());
            responseDto.setHotelId(hotelReview.getHotel().getId());
            responseDto.setCustomerName(hotelReview.getCustomerName());
            responseDto.setContent(hotelReview.getContent());
            responseDto.setRating(hotelReview.getRating());
            responseDto.setCreatedAt(hotelReview.getCreatedAt());

            // Add responseDto to the list
            responseDtoList.add(responseDto);
        }

        // Calculate skip (number of records skipped)
        int skip = (page - 1) * limit;

        // Prepare the response structure
        PageResponseDto<GetAllHotelReviewsResponseDto> pageResponseDto = new PageResponseDto<>();
        pageResponseDto.setData(responseDtoList);
        pageResponseDto.setPage(page);
        pageResponseDto.setLimit(limit);
        pageResponseDto.setSkip(skip);
        pageResponseDto.setTotals(totalHotelReviews);

        // Return the responseDtoList
        return pageResponseDto;
    }


    @Override
    public PageResponseDto getHotelReviewsByHotelId(Long hotelId, int page, int limit) {

        // Fetch tours from the repository with pagination
        Pageable pageable = PageRequest.of(page - 1, limit);

        Page<HotelReview> hotelReviewPage = hotelReviewRepository.findByHotelId(hotelId, pageable);

        // Retrieve the total number of tours
        long totalHotelReviews = hotelReviewPage.getTotalElements();

        // Retrieve the content from the fetched page
        List<HotelReview> hotelReviews = hotelReviewPage.getContent();

        // Check if the fetched list of users is empty
        if (hotelReviews.isEmpty()) {
            throw new ResourceNotFoundException("No hotel reviews found");
        }

        // Initialize the responseDtoList
        List<GetAllHotelReviewsResponseDto> responseDtoList = new ArrayList<>();

        // Convert tours to GetAllAccountsResponseDto
        for (HotelReview hotelReview  : hotelReviews) {
            GetAllHotelReviewsResponseDto responseDto = new GetAllHotelReviewsResponseDto();

            responseDto.setId(hotelReview.getId());
            responseDto.setCustomerId(hotelReview.getCustomer().getId());
            responseDto.setHotelId(hotelReview.getHotel().getId());
            responseDto.setCustomerName(hotelReview.getCustomerName());
            responseDto.setContent(hotelReview.getContent());
            responseDto.setRating(hotelReview.getRating());
            responseDto.setCreatedAt(hotelReview.getCreatedAt());

            // Add responseDto to the list
            responseDtoList.add(responseDto);
        }

        // Calculate skip (number of records skipped)
        int skip = (page - 1) * limit;

        // Prepare the response structure
        PageResponseDto<GetAllHotelReviewsResponseDto> pageResponseDto = new PageResponseDto<>();
        pageResponseDto.setData(responseDtoList);
        pageResponseDto.setPage(page);
        pageResponseDto.setLimit(limit);
        pageResponseDto.setSkip(skip);
        pageResponseDto.setTotals(totalHotelReviews);

        // Return the responseDtoList
        return pageResponseDto;
    }

    //    @Override
//    public UpdateTourResponseDto updateTour(Long tourId, UpdateTourRequestDto requestDto) {
//
//        Optional<Tour> optionalTour = tourRepository.findById(tourId);
//
//        if (!optionalTour.isPresent()) {
//            throw new ResourceNotFoundException("Tour not found");
//        }
//
//        Tour tour = optionalTour.get();
//
//        tour.setName(requestDto.getName());
//        tour.setDescription(requestDto.getDescription());
//
//        tour.setPrice(requestDto.getPrice());
//        tour.setBookedStatus(BookedStatus.valueOf(requestDto.getBookedStatus()));
//        tour.setActiveStatus(ActiveStatus.valueOf(requestDto.getActiveStatus()));
//        tour.setThumbnail(requestDto.getThumbnail());
//        tour.setUpdatedAt(LocalDateTime.now());
//
//        // Get current schedules of the tour
//        Set<Schedule> currentSchedules = tour.getSchedules();
//
//        // Remove schedules not in requestDto from tour (keep only those in requestDto)
//        Set<Schedule> schedulesToRemove = currentSchedules.stream()
//                .filter(schedule -> requestDto.getSchedules().stream()
//                        .noneMatch(dto -> dto.getId() != null && dto.getId().equals(schedule.getId())))
//                .collect(Collectors.toSet());
//
//        // Remove schedules from tour entity
//        currentSchedules.removeAll(schedulesToRemove);
//
//        // Delete removed schedules from database
//        for (Schedule schedule : schedulesToRemove) {
//            scheduleRepository.delete(schedule);
//        }
//
//        Set<Schedule> updatedSchedules = new HashSet<>();
//
//        for (Schedule schedule : requestDto.getSchedules()) {
//
//            if (schedule.getId() != null) {
//                Optional<Schedule> optionalSchedule = scheduleRepository.findById(schedule.getId());
//
//                if (!optionalSchedule.isPresent()) {
//                    throw new ResourceNotFoundException("Schedule not found");
//                }
//
//                Schedule updatedSchedule = optionalSchedule.get();
//
//                updatedSchedule.setDayOfWeek(schedule.getDayOfWeek());
//                updatedSchedule.setDate(schedule.getDate());
//
//                updatedSchedules.add(scheduleRepository.save(updatedSchedule));
//            } else {
//                // Create new schedule
//                Schedule newSchedule = new Schedule();
//                newSchedule.setDayOfWeek(schedule.getDayOfWeek());
//                newSchedule.setDate(schedule.getDate());
//
//                // Add new schedule to the tour
//                updatedSchedules.add(scheduleRepository.save(newSchedule));
//            }
//        }
//
//        tour.setSchedules(updatedSchedules);
//
//        Tour updatedTour = tourRepository.save(tour);
//
//        UpdateTourResponseDto tourResponseDto = new UpdateTourResponseDto();
//
//        tourResponseDto.setId(updatedTour.getId());
//        tourResponseDto.setName(updatedTour.getName());
//        tourResponseDto.setDescription(updatedTour.getDescription());
//
//        tourResponseDto.setPrice(updatedTour.getPrice());
//        tourResponseDto.setBookedStatus(updatedTour.getBookedStatus().toString());
//        tourResponseDto.setActiveStatus(updatedTour.getActiveStatus().toString());
//        tourResponseDto.setThumbnail(updatedTour.getThumbnail());
//
//        List<Schedule> sortedSchedules = updatedTour.getSchedules().stream()
//                .sorted(Comparator.comparing(Schedule::getDate))
//                .collect(Collectors.toList());
//
//        // Convert schedules to list
//        List<Schedule> schedules = new ArrayList<>();
//        for (Schedule schedule : sortedSchedules) {
//            Schedule savedSchedule = new Schedule();
//
//            savedSchedule.setId(schedule.getId());
//            savedSchedule.setDayOfWeek(schedule.getDayOfWeek());
//            savedSchedule.setDate(schedule.getDate());
//
//            schedules.add(savedSchedule);
//        }
//        tourResponseDto.setSchedules(schedules);
//
//        return tourResponseDto;
//    }
//
//    @Override
//    public void deleteTour(Long tourId) {
//
//        Optional<Tour> optionalTour = tourRepository.findById(tourId);
//
//        if (!optionalTour.isPresent()) {
//            throw new ResourceNotFoundException("Tour not found");
//        }
//
//        Tour tour = optionalTour.get();
//
//        for (Schedule schedule : tour.getSchedules()) {
//            scheduleRepository.deleteById(schedule.getId());
//        }
//
//        tourRepository.deleteById(tourId);
//
//    }
//
//    @Override
//    public List<GetAllToursResponseDto> getAllTours(int page, int limit) {
//        // Calculate the offset based on page and limit
//        int offset = (page - 1) * limit;
//
//        // Fetch tours from the repository with pagination
//        Pageable pageable = PageRequest.of(page - 1, limit);
//        Page<Tour> tourPage = tourRepository.findAll(pageable);
//
//        // Retrieve the content from the fetched page
//        List<Tour> tours = tourPage.getContent();
//
//        // Check if the fetched list of users is empty
//        if (tours.isEmpty()) {
//            throw new ResourceNotFoundException("No tours found");
//        }
//
//        // Initialize the responseDtoList
//        List<GetAllToursResponseDto> responseDtoList = new ArrayList<>();
//
//        // Convert tours to GetAllAccountsResponseDto
//        for (Tour tour : tours) {
//            GetAllToursResponseDto responseDto = new GetAllToursResponseDto();
//            responseDto.setId(tour.getId());
//            responseDto.setName(tour.getName());
//            responseDto.setDescription(tour.getDescription());
//
//            responseDto.setRating(tour.getRating());
//            responseDto.setNumberOfRating(tour.getNumberOfRating());
//            responseDto.setPrice(tour.getPrice());
//            responseDto.setThumbnail(tour.getThumbnail());
//            responseDto.setBookedStatus(tour.getBookedStatus().toString());
//            responseDto.setActiveStatus(tour.getActiveStatus().toString());
//            responseDto.setCreatedAt(tour.getCreatedAt());
//            responseDto.setUpdateAt(tour.getUpdatedAt());
//
//            List<Schedule> sortedSchedules = tour.getSchedules().stream()
//                    .sorted(Comparator.comparingLong(Schedule::getId))
//                    .collect(Collectors.toList());
//
//            // Convert schedules to list
//            List<Schedule> schedules = new ArrayList<>();
//            for (Schedule schedule : sortedSchedules) {
//                Schedule savedSchedule = new Schedule();
//
//                savedSchedule.setId(schedule.getId());
//                savedSchedule.setDayOfWeek(schedule.getDayOfWeek());
//                savedSchedule.setDate(schedule.getDate());
//
//                schedules.add(savedSchedule);
//            }
//            responseDto.setSchedules(schedules);
//
//            // Add responseDto to the list
//            responseDtoList.add(responseDto);
//        }
//
//        // Return the responseDtoList
//        return responseDtoList;
//    }
//
//    @Override
//    public GetTourByIdResponseDto getTourById(Long tourId) {
//        Optional<Tour> tourOptional = tourRepository.findById(tourId);
//
//        if (!tourOptional.isPresent()) {
//            throw new ResourceNotFoundException("Tour not found");
//        }
//
//        Tour tour = tourOptional.get();
//
//        GetTourByIdResponseDto responseDto = new GetTourByIdResponseDto();
//        responseDto.setId(tour.getId());
//        responseDto.setName(tour.getName());
//        responseDto.setDescription(tour.getDescription());
//
//        responseDto.setPrice(tour.getPrice());
//        responseDto.setThumbnail(tour.getThumbnail());
//        responseDto.setRating(tour.getRating());
//        responseDto.setNumberOfRating(tour.getNumberOfRating());
//        responseDto.setBookedStatus(tour.getBookedStatus().toString());
//        responseDto.setActiveStatus(tour.getActiveStatus().toString());
//        responseDto.setCreatedAt(tour.getCreatedAt());
//        responseDto.setUpdatedAt(tour.getUpdatedAt());
//
//        List<Schedule> sortedSchedules = tour.getSchedules().stream()
//                .sorted(Comparator.comparing(Schedule::getDate))
//                .collect(Collectors.toList());
//
//        // Convert schedules to list
//        List<Schedule> schedules = new ArrayList<>();
//        for (Schedule schedule : sortedSchedules) {
//            Schedule savedSchedule = new Schedule();
//
//            savedSchedule.setId(schedule.getId());
//            savedSchedule.setDayOfWeek(schedule.getDayOfWeek());
//            savedSchedule.setDate(schedule.getDate());
//
//            schedules.add(savedSchedule);
//        }
//        responseDto.setSchedules(schedules);
//
//        return responseDto;
//    }

}
