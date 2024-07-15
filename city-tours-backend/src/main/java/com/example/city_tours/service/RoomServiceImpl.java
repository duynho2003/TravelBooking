package com.example.city_tours.service;

import com.example.city_tours.dto.request.Room.CreateRoomRequestDto;
import com.example.city_tours.dto.request.Room.UpdateRoomRequestDto;
import com.example.city_tours.dto.request.RoomHoliday.CreateRoomHolidayRequestDto;
import com.example.city_tours.dto.request.RoomHoliday.UpdateRoomHolidayRequestDto;
import com.example.city_tours.dto.response.Room.CreateRoomResponseDto;
import com.example.city_tours.dto.response.Room.GetRoomByIdResponseDto;
import com.example.city_tours.dto.response.Room.UpdateRoomResponseDto;
import com.example.city_tours.dto.response.RoomBooking.CreateRoomBookingResponseDto;
import com.example.city_tours.dto.response.RoomBooking.GetRoomBookingResponseDto;
import com.example.city_tours.dto.response.RoomHoliday.CreateRoomHolidayResponseDto;
import com.example.city_tours.dto.response.RoomHoliday.GetAllRoomHolidaysResponseDto;
import com.example.city_tours.dto.response.RoomHoliday.UpdateRoomHolidayResponseDto;
import com.example.city_tours.dto.response.Tour.GetTourRoomBookingResponseDto;
import com.example.city_tours.entity.*;
import com.example.city_tours.enums.ActiveStatus;
import com.example.city_tours.enums.BookedStatus;
import com.example.city_tours.exception.ResourceNotFoundException;
import com.example.city_tours.repository.*;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class RoomServiceImpl implements RoomService{

    private final TourRepository tourRepository;
    private final HotelRepository hotelRepository;
    private final HotelImageRepository hotelImageRepository;
    private final RoomRepository roomRepository;
    private final RoomImageRepository roomImageRepository;
    private final TourRoomBookingRepository tourRoomBookingRepository;
    private final RoomBookingRepository roomBookingRepository;
    private final RoomHolidayRepository roomHolidayRepository;

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
        room.setBasePrice(requestDto.getBasePrice());
        room.setWeekendPrice(requestDto.getWeekendPrice());
        room.setDiscount(requestDto.getDiscount());
        room.setNumberOfResidents(requestDto.getNumberOfResidents());
        room.setBookedStatus(BookedStatus.NOT_BOOKED);
        room.setActiveStatus(ActiveStatus.ACTIVE);
        room.setCreatedAt(LocalDateTime.now());
        room.setUpdatedAt(LocalDateTime.now());

        Room savedRoom = roomRepository.save(room);

        Set<RoomHoliday> roomHolidays = new HashSet<>();

        if (requestDto.getRoomHolidays() != null) {
            for (CreateRoomHolidayRequestDto holidayDto : requestDto.getRoomHolidays()) {
                RoomHoliday roomHoliday = new RoomHoliday();
                roomHoliday.setRoom(savedRoom);
                roomHoliday.setDate(holidayDto.getDate());
                roomHoliday.setPrice(holidayDto.getPrice());

                roomHolidays.add(roomHoliday);
            }
        }
        roomHolidayRepository.saveAll(roomHolidays);

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
        responseDto.setBasePrice(room.getBasePrice());
        responseDto.setWeekendPrice(room.getWeekendPrice());
        responseDto.setDiscount(room.getDiscount());
        responseDto.setNumberOfResidents(room.getNumberOfResidents());
        responseDto.setBookedStatus(room.getBookedStatus().toString());
        responseDto.setActiveStatus(room.getActiveStatus().toString());
        responseDto.setCreatedAt(room.getCreatedAt());
        responseDto.setHotelId(hotelId);

        List<CreateRoomHolidayResponseDto> roomHolidayResponseDtos = new ArrayList<>();
        for (RoomHoliday roomHoliday : roomHolidays) {
            CreateRoomHolidayResponseDto roomHolidayDto = new CreateRoomHolidayResponseDto();
            roomHolidayDto.setId(roomHoliday.getId());
            roomHolidayDto.setDate(roomHoliday.getDate());
            roomHolidayDto.setPrice(roomHoliday.getPrice());
            roomHolidayResponseDtos.add(roomHolidayDto);
        }
        responseDto.setRoomHolidays(roomHolidayResponseDtos);

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

        Set<UpdateRoomHolidayRequestDto> roomHolidays = requestDto.getRoomHolidays();

        boolean deleteAllRoomHolidays = roomHolidays.stream().anyMatch(holidayDto -> holidayDto.getId() == null);

        if (deleteAllRoomHolidays) {
            List<RoomHoliday> roomHolidayList = roomHolidayRepository.findByRoomId(room.getId());
            roomHolidayRepository.deleteAllInBatch(roomHolidayList);

            Set<RoomHoliday> roomHolidaySet = new HashSet<>();
            for (UpdateRoomHolidayRequestDto holidayDto : requestDto.getRoomHolidays()) {
                RoomHoliday newHoliday = new RoomHoliday();
                newHoliday.setDate(holidayDto.getDate());
                newHoliday.setPrice(holidayDto.getPrice());
                newHoliday.setRoom(room);
                roomHolidaySet.add(newHoliday);
            }
            roomHolidayRepository.saveAll(roomHolidaySet);
        } else {
            for (UpdateRoomHolidayRequestDto holidayDto : roomHolidays) {
                if (holidayDto.getId() != null) {
                    RoomHoliday existingHoliday = roomHolidayRepository.findById(holidayDto.getId())
                            .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy ngày nghỉ"));
                    existingHoliday.setDate(holidayDto.getDate());
                    existingHoliday.setPrice(holidayDto.getPrice());
                }
            }
        }

        List<RoomImage> roomImageList = roomImageRepository.findByRoomId(room.getId());
        roomImageRepository.deleteAll(roomImageList);

        room.setRoomNumber(requestDto.getRoomNumber());
        room.setType(requestDto.getType());
        room.setBasePrice(requestDto.getBasePrice());
        room.setWeekendPrice(requestDto.getWeekendPrice());
        room.setDiscount(requestDto.getDiscount());
        room.setNumberOfResidents(requestDto.getNumberOfResidents());
        room.setActiveStatus(ActiveStatus.valueOf(requestDto.getActiveStatus()));
        room.setUpdatedAt(LocalDateTime.now());

        Set<RoomImage> roomImages = new HashSet<>();
        for (String imageUrl : requestDto.getImageUrls()) {
            RoomImage roomImage = new RoomImage();
            roomImage.setRoom(room);
            roomImage.setImageUrl(imageUrl);
            roomImages.add(roomImage);
        }
        roomImageRepository.saveAll(roomImages);



        Room savedRoom = roomRepository.save(room);

        UpdateRoomResponseDto responseDto = new UpdateRoomResponseDto();
        responseDto.setId(room.getId());
        responseDto.setRoomNumber(room.getRoomNumber());
        responseDto.setType(room.getType());
        responseDto.setBasePrice(room.getBasePrice());
        responseDto.setWeekendPrice(room.getWeekendPrice());
        responseDto.setDiscount(room.getDiscount());
        responseDto.setNumberOfResidents(room.getNumberOfResidents());
        responseDto.setActiveStatus(room.getActiveStatus().toString());
        responseDto.setUpdatedAt(room.getUpdatedAt());

        // Thêm danh sách ngày nghỉ vào responseDto
        List<UpdateRoomHolidayResponseDto> roomHolidayResponseDtos = new ArrayList<>();
        for (RoomHoliday holiday : room.getRoomHolidays()) {
            UpdateRoomHolidayResponseDto dto = new UpdateRoomHolidayResponseDto();
            dto.setId(holiday.getId());
            dto.setDate(holiday.getDate());
            dto.setPrice(holiday.getPrice());
            roomHolidayResponseDtos.add(dto);
        }
        responseDto.setRoomHolidays(roomHolidayResponseDtos);

        // Thêm danh sách các URL hình ảnh vào responseDto
//        List<String> imageUrls = new ArrayList<>();
//        for (RoomImage roomImage : roomImages) {
//            imageUrls.add(roomImage.getImageUrl());
//        }
//        responseDto.setImageUrls(imageUrls);

        return responseDto;
    }

    @Override
    @Transactional
    public void deleteRoomHolidaysByRoomId(Long roomId) {
        List<RoomHoliday> roomHolidays = roomHolidayRepository.findByRoomId(roomId);
        if (!roomHolidays.isEmpty()) {
            roomHolidayRepository.deleteAll(roomHolidays);
        }
    }

    @Override
    @Transactional
    public void deleteRoomImagesByRoomId(Long roomId) {
        List<RoomImage> roomImages = roomImageRepository.findByRoomId(roomId);
        if (!roomImages.isEmpty()) {
            roomImageRepository.deleteAll(roomImages);
        }
    }

    @Override
    public void deleteRoom(Long roomId) {

        Optional<Room> optionalRoom = roomRepository.findById(roomId);

        if (!optionalRoom.isPresent()) {
            throw new ResourceNotFoundException("Room not found");
        }

        Room room = optionalRoom.get();

        for (Hotel hotel : room.getHotels()) {
            hotel.getRooms().remove(room);
        }
        room.getHotels().clear();

        deleteRoomImagesByRoomId(roomId);

        room.getRoomHolidays().clear();

        roomRepository.deleteById(roomId);

    }

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
        responseDto.setBasePrice(room.getBasePrice());
        responseDto.setWeekendPrice(room.getWeekendPrice());
        responseDto.setDiscount(room.getDiscount());
        responseDto.setNumberOfResidents(room.getNumberOfResidents());
        responseDto.setBookedStatus(room.getBookedStatus().toString());
        responseDto.setActiveStatus(room.getActiveStatus().toString());
        responseDto.setCreatedAt(room.getCreatedAt());
        responseDto.setUpdatedAt(room.getUpdatedAt());

        List<GetAllRoomHolidaysResponseDto> roomHolidayResponseDtos = new ArrayList<>();
        for (RoomHoliday roomHoliday : room.getRoomHolidays()) {
            GetAllRoomHolidaysResponseDto roomHolidayDto = new GetAllRoomHolidaysResponseDto();
            roomHolidayDto.setId(roomHoliday.getId());
            roomHolidayDto.setDate(roomHoliday.getDate());
            roomHolidayDto.setPrice(roomHoliday.getPrice());
            roomHolidayResponseDtos.add(roomHolidayDto);
        }
        responseDto.setRoomHolidays(roomHolidayResponseDtos);

        List<RoomImage> sortedRoomImages = room.getImages().stream()
                .sorted(Comparator.comparingLong(RoomImage::getId))
                .collect(Collectors.toList());

        List<String> imageUrls = new ArrayList<>();

        for (RoomImage roomImage : sortedRoomImages) {
            String imageUrl = roomImage.getImageUrl();
            imageUrls.add(imageUrl);
        }

        responseDto.setImageUrls(imageUrls);

        List<TourRoomBooking> tourRoomBookings = tourRoomBookingRepository.findByRoom(room);

        List<GetTourRoomBookingResponseDto> tourRoomBookingDtos = new ArrayList<>();
        for (TourRoomBooking tourRoomBooking : tourRoomBookings) {
            GetTourRoomBookingResponseDto tourRoomBookingDto = new GetTourRoomBookingResponseDto();
            tourRoomBookingDto.setId(tourRoomBooking.getId());
            tourRoomBookingDto.setDate(tourRoomBooking.getDate());
            tourRoomBookingDto.setStartHour(tourRoomBooking.getStartHour());
            tourRoomBookingDto.setEndHour(tourRoomBooking.getEndHour());
            tourRoomBookingDto.setPrice(tourRoomBooking.getPrice());
            tourRoomBookingDto.setCreatedAt(tourRoomBooking.getCreatedAt());
            tourRoomBookingDto.setUpdatedAt(tourRoomBooking.getUpdatedAt());
            tourRoomBookingDtos.add(tourRoomBookingDto);
        }

        // Set tour room bookings to roomDto
        responseDto.setTourRoomBookings(tourRoomBookingDtos);

        List<RoomBooking> roomBookings = roomBookingRepository.findByRoom(room);

        List<GetRoomBookingResponseDto> roomBookingDtos = new ArrayList<>();
        for (RoomBooking roomBooking : roomBookings) {
            GetRoomBookingResponseDto roomBookingDto = new GetRoomBookingResponseDto();
            roomBookingDto.setId(roomBooking.getId());
            roomBookingDto.setDate(roomBooking.getDate());
            roomBookingDto.setStartHour(roomBooking.getStartHour());
            roomBookingDto.setEndHour(roomBooking.getEndHour());
            roomBookingDto.setPrice(roomBooking.getPrice());
            roomBookingDto.setCreatedAt(roomBooking.getCreatedAt());
            roomBookingDto.setUpdatedAt(roomBooking.getUpdatedAt());
            roomBookingDtos.add(roomBookingDto);
        }

        // Set tour room bookings to roomDto
        responseDto.setRoomBookings(roomBookingDtos);

        return responseDto;
    }

}
