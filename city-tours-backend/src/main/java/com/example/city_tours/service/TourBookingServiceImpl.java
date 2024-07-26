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
public class TourBookingServiceImpl implements TourBookingService{

    private final TourRepository tourRepository;
    private final TourRoomBookingRepository tourRoomBookingRepository;
    private final RoomRepository roomRepository;
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
//        tourBookingResponseDto.setCustomerId(savedTourBooking.getCustomer().getId());

        return tourBookingResponseDto;
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
