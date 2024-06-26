package com.example.city_tours.service;

import com.example.city_tours.dto.request.Hotel.CreateHotelRequestDto;
import com.example.city_tours.dto.request.Hotel.UpdateHotelRequestDto;
import com.example.city_tours.dto.request.Room.CreateRoomRequestDto;
import com.example.city_tours.dto.request.Room.UpdateRoomRequestDto;
import com.example.city_tours.dto.response.Hotel.CreateHotelResponseDto;
import com.example.city_tours.dto.response.Hotel.GetAllHotelsResponseDto;
import com.example.city_tours.dto.response.Hotel.UpdateHotelResponseDto;
import com.example.city_tours.dto.response.Room.CreateRoomResponseDto;
import com.example.city_tours.dto.response.Room.GetRoomByIdResponseDto;
import com.example.city_tours.dto.response.Room.UpdateRoomResponseDto;
import com.example.city_tours.entity.*;
import com.example.city_tours.enums.ActiveStatus;
import com.example.city_tours.enums.BookedStatus;
import com.example.city_tours.exception.ResourceNotFoundException;
import com.example.city_tours.repository.HotelRepository;
import com.example.city_tours.repository.ScheduleRepository;
import com.example.city_tours.repository.TourRepository;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class RoomServiceImpl implements RoomService{

    private final TourRepository tourRepository;
    private final ScheduleRepository scheduleRepository;
    private final HotelRepository hotelRepository;
    private final HotelImageRepository hotelImageRepository;
    private final RoomRepository roomRepository;
    private final RoomImageRepository roomImageRepository;

    @Override
    public CreateRoomResponseDto createRoom(Long hotelId, CreateRoomRequestDto requestDto) {

        Optional<Hotel> optionalHotel = hotelRepository.findById(hotelId);

        if (!optionalHotel.isPresent()) {
            throw new ResourceNotFoundException("Hotel not found");
        }

        Hotel hotel = optionalHotel.get();

        Room room = new Room();

        room.setRoomNumber(requestDto.getRoomNumber());
        room.setType(requestDto.getType());
        room.setPrice(requestDto.getPrice());
        room.setBookedStatus(BookedStatus.NOT_BOOKED);
        room.setActiveStatus(ActiveStatus.ACTIVE);
        room.setCreatedAt(LocalDateTime.now());
        room.setUpdatedAt(LocalDateTime.now());

        Room savedRoom = roomRepository.save(room);

        Set<RoomImage> roomImages = new HashSet<>();

        for (String imageUrl : requestDto.getImageUrls()) {
            RoomImage roomImage = new RoomImage();

            roomImage.setRoom(savedRoom);
            roomImage.setImageUrl(imageUrl);

            roomImages.add(roomImage);
        }

        roomImageRepository.saveAll(roomImages);

        hotel.getRooms().add(savedRoom);

        hotelRepository.save(hotel);

        CreateRoomResponseDto responseDto = new CreateRoomResponseDto();

        responseDto.setId(room.getId());
        responseDto.setRoomNumber(room.getRoomNumber());
        responseDto.setType(room.getType());
        responseDto.setPrice(room.getPrice());
        responseDto.setBookedStatus(room.getBookedStatus().toString());
        responseDto.setActiveStatus(room.getActiveStatus().toString());
        responseDto.setCreatedAt(room.getCreatedAt());
        responseDto.setHotelId(hotelId);

        List<String> imageUrls = new ArrayList<>();

        for (RoomImage roomImage : roomImages) {
            imageUrls.add(roomImage.getImageUrl());
        }

        responseDto.setImageUrls(imageUrls);

        return responseDto;
    }

    @Override
    @Transactional
    public UpdateRoomResponseDto updateRoom(Long roomId, UpdateRoomRequestDto requestDto) {

        Optional<Room> optionalRoom = roomRepository.findById(roomId);

        if (!optionalRoom.isPresent()) {
            throw new ResourceNotFoundException("Room not found");
        }

        Room room = optionalRoom.get();

        room.setRoomNumber(requestDto.getRoomNumber());
        room.setType(requestDto.getType());
        room.setPrice(requestDto.getPrice());
        room.setBookedStatus(BookedStatus.valueOf(requestDto.getBookedStatus()));
        room.setActiveStatus(ActiveStatus.valueOf(requestDto.getActiveStatus()));
        room.setUpdatedAt(LocalDateTime.now());

        deleteRoomImagesByRoomId(roomId);

        Room savedRoom = roomRepository.save(room);

        Set<RoomImage> roomImages = new HashSet<>();

        for (String imageUrl : requestDto.getImageUrls()) {
            RoomImage roomImage = new RoomImage();

            roomImage.setRoom(savedRoom);
            roomImage.setImageUrl(imageUrl);

            roomImages.add(roomImage);
        }

        roomImageRepository.saveAll(roomImages);

        UpdateRoomResponseDto responseDto = new UpdateRoomResponseDto();

        responseDto.setId(room.getId());
        responseDto.setRoomNumber(room.getRoomNumber());
        responseDto.setType(room.getType());
        responseDto.setPrice(room.getPrice());
        responseDto.setBookedStatus(room.getBookedStatus().toString());
        responseDto.setActiveStatus(room.getActiveStatus().toString());
        responseDto.setUpdatedAt(room.getUpdatedAt());

        List<String> imageUrls = new ArrayList<>();

        for (RoomImage roomImage : roomImages) {
            imageUrls.add(roomImage.getImageUrl());
        }

        responseDto.setImageUrls(imageUrls);

        return responseDto;
    }

    @Override
    @Transactional
    public void deleteRoomImagesByRoomId(Long roomId) {
        List<RoomImage> roomImages = roomImageRepository.findByRoomId(roomId);
        roomImageRepository.deleteAll(roomImages);
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
//        tour.setAddress(requestDto.getAddress());
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
//        tourResponseDto.setAddress(updatedTour.getAddress());
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
    @Override
    public void deleteRoom(Long roomId) {

        Optional<Room> optionalRoom = roomRepository.findById(roomId);

        if (!optionalRoom.isPresent()) {
            throw new ResourceNotFoundException("Room not found");
        }

        Room room = optionalRoom.get();

        for (Hotel hotel : room.getHotels()) {
            hotel.getRooms().remove(room); // Xóa phòng khỏi danh sách phòng của khách sạn
        }
        room.getHotels().clear();

        deleteRoomImagesByRoomId(roomId);

        roomRepository.deleteById(roomId);

    }

//
//    @Override
//    public List<GetAllHotelsResponseDto> getAllHotels(int page, int limit) {
//        // Calculate the offset based on page and limit
//        int offset = (page - 1) * limit;
//
//        // Fetch tours from the repository with pagination
//        Pageable pageable = PageRequest.of(page - 1, limit);
//        Page<Hotel> hotelPage = hotelRepository.findAll(pageable);
//
//        // Retrieve the content from the fetched page
//        List<Hotel> hotels = hotelPage.getContent();
//
//        // Check if the fetched list of users is empty
//        if (hotels.isEmpty()) {
//            throw new ResourceNotFoundException("No hotels found");
//        }
//
//        // Initialize the responseDtoList
//        List<GetAllHotelsResponseDto> responseDtoList = new ArrayList<>();
//
//        // Convert tours to GetAllAccountsResponseDto
//        for (Hotel hotel : hotels) {
//            GetAllHotelsResponseDto responseDto = new GetAllHotelsResponseDto();
//
//            responseDto.setId(hotel.getId());
//            responseDto.setName(hotel.getName());
//            responseDto.setDescription(hotel.getDescription());
//            responseDto.setAddress(hotel.getAddress());
//            responseDto.setRating(hotel.getRating());
//            responseDto.setNumberOfRating(hotel.getNumberOfRating());
//            responseDto.setActiveStatus(hotel.getActiveStatus().toString());
//            responseDto.setCreatedAt(hotel.getCreatedAt());
//            responseDto.setUpdatedAt(hotel.getUpdatedAt());
//
//            List<String> thumbnailUrls = new ArrayList<>();
//
//            for (HotelImage hotelImage : hotel.getImages()) {
//                thumbnailUrls.add(hotelImage.getImageUrl());
//            }
//
//            responseDto.setThumbnailUrls(thumbnailUrls);
//
//            responseDtoList.add(responseDto);
//        }
//
//        // Return the responseDtoList
//        return responseDtoList;
//    }



    @Override
    public GetRoomByIdResponseDto getRoomById(Long roomId) {
        Optional<Room> roomOptional = roomRepository.findById(roomId);

        if (!roomOptional.isPresent()) {
            throw new ResourceNotFoundException("Room not found");
        }

        Room room = roomOptional.get();

        GetRoomByIdResponseDto responseDto = new GetRoomByIdResponseDto();

        responseDto.setId(room.getId());
        responseDto.setRoomNumber(room.getRoomNumber());
        responseDto.setType(room.getType());
        responseDto.setPrice(room.getPrice());
        responseDto.setBookedStatus(room.getBookedStatus().toString());
        responseDto.setActiveStatus(room.getActiveStatus().toString());
        responseDto.setCreatedAt(room.getCreatedAt());
        responseDto.setUpdatedAt(room.getUpdatedAt());

        List<RoomImage> sortedRoomImages = room.getImages().stream()
                .sorted(Comparator.comparingLong(RoomImage::getId))
                .collect(Collectors.toList());

        List<String> imageUrls = new ArrayList<>();

        for (RoomImage roomImage : sortedRoomImages) {
            String imageUrl = roomImage.getImageUrl();
            imageUrls.add(imageUrl);
        }

        responseDto.setImageUrls(imageUrls);

        return responseDto;
    }

}
