package com.example.city_tours.service;

import com.example.city_tours.dto.request.Tour.CreateTourRequestDto;
import com.example.city_tours.dto.request.Tour.UpdateTourRequestDto;
import com.example.city_tours.dto.response.Tour.CreateTourResponseDto;
import com.example.city_tours.dto.response.Tour.GetAllToursResponseDto;
import com.example.city_tours.dto.response.Tour.GetTourByIdResponseDto;
import com.example.city_tours.dto.response.Tour.UpdateTourResponseDto;
import com.example.city_tours.dto.response.User.GetAccountByIdResponseDto;
import com.example.city_tours.dto.response.User.GetAllAccountsResponseDto;
import com.example.city_tours.entity.*;
import com.example.city_tours.enums.ActiveStatus;
import com.example.city_tours.enums.BookedStatus;
import com.example.city_tours.enums.UserStatus;
import com.example.city_tours.exception.ResourceNotFoundException;
import com.example.city_tours.repository.*;
import jakarta.persistence.criteria.Predicate;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class TourServiceImpl implements TourService{

    private final TourRepository tourRepository;
    private final ScheduleRepository scheduleRepository;

    @Override
    public CreateTourResponseDto createTour(CreateTourRequestDto requestDto) {

        Tour tour = new Tour();
        tour.setCode(requestDto.getCode());
        tour.setName(requestDto.getName());
        tour.setDescription(requestDto.getDescription());
        tour.setRating(0.0);
        tour.setNumberOfRating(0);
        tour.setPrice(requestDto.getPrice());
        tour.setDiscount(requestDto.getDiscount());
        tour.setLocations(requestDto.getLocations());
        tour.setDepart(requestDto.getDepart());
        tour.setStartTime(requestDto.getStartTime());
        tour.setAdults(requestDto.getAdults());
        tour.setChildren(requestDto.getChildren());
        tour.setBaby(requestDto.getBaby());
        tour.setThumbnail(requestDto.getThumbnail());
        tour.setBookedStatus(BookedStatus.NOT_BOOKED);
        tour.setActiveStatus(ActiveStatus.ACTIVE);
        tour.setCreatedAt(LocalDateTime.now());
        tour.setUpdatedAt(LocalDateTime.now());

        Tour savedTour = tourRepository.save(tour);

        Set<Schedule> schedules = new HashSet<>();

        for (Schedule schedule : requestDto.getSchedules()) {
            Schedule savedSchedule = scheduleRepository.save(schedule);
            schedules.add(savedSchedule);
        }

        savedTour.setSchedules(schedules);

        Tour updatedTour = tourRepository.save(savedTour);

        CreateTourResponseDto tourResponseDto = new CreateTourResponseDto();

        tourResponseDto.setId(updatedTour.getId());
        tourResponseDto.setCode(updatedTour.getCode());
        tourResponseDto.setName(updatedTour.getName());
        tourResponseDto.setDescription(updatedTour.getDescription());
        tourResponseDto.setDepart(updatedTour.getDepart());
        tourResponseDto.setStartTime(updatedTour.getStartTime());
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
//
//        // Convert schedules to list
//        List<Schedule> schedulesResponse = new ArrayList<>();
//
//        for (Schedule schedule : updatedTour.getSchedules().stream().toList()) {
//            Schedule savedSchedule = new Schedule();
//
//            savedSchedule.setId(schedule.getId());
//            savedSchedule.setDayOfWeek(schedule.getDayOfWeek());
//            savedSchedule.setDate(schedule.getDate());
//
//            schedules.add(savedSchedule);
//        }

//        tourResponseDto.setSchedules(schedulesResponse);

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

        // Get current schedules of the tour
        Set<Schedule> currentSchedules = tour.getSchedules();

        // Remove schedules not in requestDto from tour (keep only those in requestDto)
        Set<Schedule> schedulesToRemove = currentSchedules.stream()
                .filter(schedule -> requestDto.getSchedules().stream()
                        .noneMatch(dto -> dto.getId() != null && dto.getId().equals(schedule.getId())))
                .collect(Collectors.toSet());

        // Remove schedules from tour entity
        currentSchedules.removeAll(schedulesToRemove);

        // Delete removed schedules from database
        for (Schedule schedule : schedulesToRemove) {
            scheduleRepository.delete(schedule);
        }

        Set<Schedule> updatedSchedules = new HashSet<>();

        for (Schedule schedule : requestDto.getSchedules()) {

            if (schedule.getId() != null) {
                Optional<Schedule> optionalSchedule = scheduleRepository.findById(schedule.getId());

                if (!optionalSchedule.isPresent()) {
                    throw new ResourceNotFoundException("Schedule not found");
                }

                Schedule updatedSchedule = optionalSchedule.get();

                updatedSchedule.setDayOfWeek(schedule.getDayOfWeek());
                updatedSchedule.setDate(schedule.getDate());
                updatedSchedule.setActivities(schedule.getActivities());

                updatedSchedules.add(scheduleRepository.save(updatedSchedule));
            } else {
                // Create new schedule
                Schedule newSchedule = new Schedule();
                newSchedule.setDayOfWeek(schedule.getDayOfWeek());
                newSchedule.setDate(schedule.getDate());
                newSchedule.setActivities(schedule.getActivities());

                // Add new schedule to the tour
                updatedSchedules.add(scheduleRepository.save(newSchedule));
            }
        }

        tour.setSchedules(updatedSchedules);

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

        List<Schedule> sortedSchedules = updatedTour.getSchedules().stream()
                .sorted(Comparator.comparing(Schedule::getDate))
                .collect(Collectors.toList());

        // Convert schedules to list
        List<Schedule> schedules = new ArrayList<>();
        for (Schedule schedule : sortedSchedules) {
            Schedule savedSchedule = new Schedule();

            savedSchedule.setId(schedule.getId());
            savedSchedule.setDayOfWeek(schedule.getDayOfWeek());
            savedSchedule.setDate(schedule.getDate());

            schedules.add(savedSchedule);
        }
        tourResponseDto.setSchedules(schedules);

        return tourResponseDto;
    }

    @Override
    public void deleteTour(Long tourId) {

        Optional<Tour> optionalTour = tourRepository.findById(tourId);

        if (!optionalTour.isPresent()) {
            throw new ResourceNotFoundException("Tour not found");
        }

        Tour tour = optionalTour.get();

        for (Schedule schedule : tour.getSchedules()) {
            scheduleRepository.deleteById(schedule.getId());
        }

        tourRepository.deleteById(tourId);

    }

    @Override
    public List<GetAllToursResponseDto> getAllTours(int page, int limit, String search, String date, String status) {
        // Calculate the offset based on page and limit
        int offset = (page - 1) * limit;

        // Fetch tours from the repository with pagination
        Pageable pageable = PageRequest.of(page - 1, limit);

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

            return predicate;
        };

        Page<Tour> tourPage = tourRepository.findAll(spec, pageable);

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
            responseDto.setLocations(tour.getLocations());
            responseDto.setThumbnail(tour.getThumbnail());
            responseDto.setStartTime(tour.getStartTime());
            responseDto.setBookedStatus(tour.getBookedStatus().toString());
            responseDto.setActiveStatus(tour.getActiveStatus().toString());
            responseDto.setCreatedAt(tour.getCreatedAt());
            responseDto.setUpdateAt(tour.getUpdatedAt());

            List<Schedule> sortedSchedules = tour.getSchedules().stream()
                    .sorted(Comparator.comparingLong(Schedule::getId))
                    .collect(Collectors.toList());

            // Convert schedules to list
            List<Schedule> schedules = new ArrayList<>();
            for (Schedule schedule : sortedSchedules) {
                Schedule savedSchedule = new Schedule();

                savedSchedule.setId(schedule.getId());
                savedSchedule.setDayOfWeek(schedule.getDayOfWeek());
                savedSchedule.setDate(schedule.getDate());

                schedules.add(savedSchedule);
            }
            responseDto.setSchedules(schedules);

            // Add responseDto to the list
            responseDtoList.add(responseDto);
        }

        // Return the responseDtoList
        return responseDtoList;
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
        responseDto.setStartTime(tour.getStartTime());
        responseDto.setBookedStatus(tour.getBookedStatus().toString());
        responseDto.setActiveStatus(tour.getActiveStatus().toString());
        responseDto.setCreatedAt(tour.getCreatedAt());
        responseDto.setUpdatedAt(tour.getUpdatedAt());

        List<Schedule> sortedSchedules = tour.getSchedules().stream()
                .sorted(Comparator.comparing(Schedule::getDate))
                .collect(Collectors.toList());

        // Convert schedules to list
        List<Schedule> schedules = new ArrayList<>();
        for (Schedule schedule : sortedSchedules) {
            Schedule savedSchedule = new Schedule();

            savedSchedule.setId(schedule.getId());
            savedSchedule.setDayOfWeek(schedule.getDayOfWeek());
            savedSchedule.setActivities(schedule.getActivities());
            savedSchedule.setDate(schedule.getDate());

            schedules.add(savedSchedule);
        }
        responseDto.setSchedules(schedules);

        return responseDto;
    }

}
