package com.example.city_tours.service;

import com.example.city_tours.dto.request.RoomBooking.CreateRoomBookingRequestDto;
import com.example.city_tours.dto.request.TourRoomBooking.CreateTourRoomBookingRequestDto;
import com.example.city_tours.dto.response.RoomBooking.CreateRoomBookingResponseDto;
import com.example.city_tours.dto.response.RoomBooking.GetRoomBookingResponseDto;
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
    private final ScheduleRepository scheduleRepository;
    private final TourRoomBookingRepository tourRoomBookingRepository;
    private final RoomRepository roomRepository;
    private final CustomerRepository customerRepository;
    private final RoomBookingRepository roomBookingRepository;
    private final UserRepository userRepository;

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

        roomBooking.setDate(requestDto.getDate());
        roomBooking.setStartHour(requestDto.getStartHour());
        roomBooking.setEndHour(requestDto.getEndHour());
        roomBooking.setPrice(requestDto.getPrice());
        roomBooking.setReviewStatus(ReviewStatus.NOT_PROVIDED);
        roomBooking.setRoomType(requestDto.getRoomType());
        roomBooking.setCreatedAt(LocalDateTime.now());
        roomBooking.setUpdatedAt(LocalDateTime.now());
        roomBooking.setCustomer(customer);
        roomBooking.setRoom(optionalRoom.get());

        RoomBooking savedRoomBooking = roomBookingRepository.save(roomBooking);

        CreateRoomBookingResponseDto responseDto = new CreateRoomBookingResponseDto();

        responseDto.setId(savedRoomBooking.getId());
        responseDto.setDate(savedRoomBooking.getDate());
        responseDto.setStartHour(savedRoomBooking.getStartHour());
        responseDto.setEndHour(savedRoomBooking.getEndHour());
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
            responseDto.setDate(roomBooking.getDate());
            responseDto.setStartHour(roomBooking.getStartHour());
            responseDto.setEndHour(roomBooking.getEndHour());
            responseDto.setPrice(roomBooking.getPrice());
            responseDto.setReviewStatus(roomBooking.getReviewStatus().toString());
            responseDto.setRoomType(roomBooking.getRoomType());
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
