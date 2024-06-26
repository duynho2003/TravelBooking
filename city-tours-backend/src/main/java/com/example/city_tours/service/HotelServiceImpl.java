package com.example.city_tours.service;

import com.example.city_tours.dto.request.Hotel.CreateHotelRequestDto;
import com.example.city_tours.dto.request.Hotel.UpdateHotelRequestDto;
import com.example.city_tours.dto.response.Hotel.CreateHotelResponseDto;
import com.example.city_tours.dto.response.Hotel.GetAllHotelsResponseDto;
import com.example.city_tours.dto.response.Hotel.GetHotelByIdResponseDto;
import com.example.city_tours.dto.response.Hotel.UpdateHotelResponseDto;
import com.example.city_tours.dto.response.Room.RoomResponseDto;
import com.example.city_tours.entity.*;
import com.example.city_tours.enums.ActiveStatus;
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
public class HotelServiceImpl implements HotelService{

    private final TourRepository tourRepository;
    private final ScheduleRepository scheduleRepository;
    private final HotelRepository hotelRepository;
    private final HotelImageRepository hotelImageRepository;

    @Override
    public CreateHotelResponseDto createHotel(CreateHotelRequestDto requestDto) {

        Hotel hotel = new Hotel();

        hotel.setName(requestDto.getName());
        hotel.setDescription(requestDto.getDescription());
        hotel.setAddress(requestDto.getAddress());
        hotel.setRating(0.0);
        hotel.setNumberOfRating(0);
        hotel.setActiveStatus(ActiveStatus.ACTIVE);
        hotel.setCreatedAt(LocalDateTime.now());
        hotel.setUpdatedAt(LocalDateTime.now());

        Hotel savedHotel = hotelRepository.save(hotel);

        Set<HotelImage> hotelImages = new HashSet<>();

        for (String imageUrl : requestDto.getThumbnailUrls()) {
            HotelImage hotelImage = new HotelImage();

            hotelImage.setHotel(savedHotel);
            hotelImage.setImageUrl(imageUrl);

            hotelImages.add(hotelImage);
        }

        hotelImageRepository.saveAll(hotelImages);

        CreateHotelResponseDto responseDto = new CreateHotelResponseDto();

        responseDto.setId(hotel.getId());
        responseDto.setName(hotel.getName());
        responseDto.setDescription(hotel.getDescription());
        responseDto.setAddress(hotel.getAddress());
        responseDto.setRating(hotel.getRating());
        responseDto.setNumberOfRating(hotel.getNumberOfRating());
        responseDto.setActiveStatus(hotel.getActiveStatus().toString());
        responseDto.setCreatedAt(hotel.getCreatedAt());

        List<String> thumbnailUrls = new ArrayList<>();

        for (HotelImage hotelImage : hotelImages) {
            thumbnailUrls.add(hotelImage.getImageUrl());
        }

        responseDto.setThumbnailUrls(thumbnailUrls);

        return responseDto;
    }

    @Override
    @Transactional
    public UpdateHotelResponseDto updateHotel(Long hotelId, UpdateHotelRequestDto requestDto) {

        Optional<Hotel> optionalHotel = hotelRepository.findById(hotelId);

        if (!optionalHotel.isPresent()) {
            throw new ResourceNotFoundException("Hotel not found");
        }

        Hotel hotel = optionalHotel.get();

        hotel.setName(requestDto.getName());
        hotel.setDescription(requestDto.getDescription());
        hotel.setAddress(requestDto.getAddress());
        hotel.setActiveStatus(ActiveStatus.valueOf(requestDto.getActiveStatus()));
        hotel.setUpdatedAt(LocalDateTime.now());

        deleteHotelImagesByHotelId(hotelId);

        Hotel savedHotel = hotelRepository.save(hotel);

        Set<HotelImage> hotelImages = new HashSet<>();

        for (String imageUrl : requestDto.getThumbnailUrls()) {
            HotelImage hotelImage = new HotelImage();

            hotelImage.setHotel(savedHotel);
            hotelImage.setImageUrl(imageUrl);

            hotelImages.add(hotelImage);
        }

        hotelImageRepository.saveAll(hotelImages);

        UpdateHotelResponseDto responseDto = new UpdateHotelResponseDto();

        responseDto.setId(hotel.getId());
        responseDto.setName(hotel.getName());
        responseDto.setDescription(hotel.getDescription());
        responseDto.setAddress(hotel.getAddress());
        responseDto.setRating(hotel.getRating());
        responseDto.setNumberOfRating(hotel.getNumberOfRating());
        responseDto.setActiveStatus(hotel.getActiveStatus().toString());
        responseDto.setCreatedAt(hotel.getCreatedAt());
        responseDto.setUpdatedAt(hotel.getUpdatedAt());

        List<String> thumbnailUrls = new ArrayList<>();

        for (HotelImage hotelImage : hotelImages) {
            thumbnailUrls.add(hotelImage.getImageUrl());
        }

        responseDto.setThumbnailUrls(thumbnailUrls);

        return responseDto;
    }

    @Override
    @Transactional
    public void deleteHotelImagesByHotelId(Long hotelId) {
        List<HotelImage> hotelImages = hotelImageRepository.findByHotelId(hotelId);
        hotelImageRepository.deleteAll(hotelImages);
    }

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

    @Override
    public List<GetAllHotelsResponseDto> getAllHotels(int page, int limit) {
        // Calculate the offset based on page and limit
        int offset = (page - 1) * limit;

        // Fetch tours from the repository with pagination
        Pageable pageable = PageRequest.of(page - 1, limit);
        Page<Hotel> hotelPage = hotelRepository.findAll(pageable);

        // Retrieve the content from the fetched page
        List<Hotel> hotels = hotelPage.getContent();

        // Check if the fetched list of users is empty
        if (hotels.isEmpty()) {
            throw new ResourceNotFoundException("No hotels found");
        }

        // Initialize the responseDtoList
        List<GetAllHotelsResponseDto> responseDtoList = new ArrayList<>();

        // Convert tours to GetAllAccountsResponseDto
        for (Hotel hotel : hotels) {
            GetAllHotelsResponseDto responseDto = new GetAllHotelsResponseDto();

            responseDto.setId(hotel.getId());
            responseDto.setName(hotel.getName());
            responseDto.setDescription(hotel.getDescription());
            responseDto.setAddress(hotel.getAddress());
            responseDto.setRating(hotel.getRating());
            responseDto.setNumberOfRating(hotel.getNumberOfRating());
            responseDto.setActiveStatus(hotel.getActiveStatus().toString());
            responseDto.setCreatedAt(hotel.getCreatedAt());
            responseDto.setUpdatedAt(hotel.getUpdatedAt());

            List<String> thumbnailUrls = new ArrayList<>();

            for (HotelImage hotelImage : hotel.getImages()) {
                thumbnailUrls.add(hotelImage.getImageUrl());
            }

            responseDto.setThumbnailUrls(thumbnailUrls);

            responseDtoList.add(responseDto);
        }

        // Return the responseDtoList
        return responseDtoList;
    }

    @Override
    public GetHotelByIdResponseDto getHotelById(Long hotelId) {
        Optional<Hotel> hotelOptional = hotelRepository.findById(hotelId);

        if (!hotelOptional.isPresent()) {
            throw new ResourceNotFoundException("Hotel not found");
        }

        Hotel hotel = hotelOptional.get();

        GetHotelByIdResponseDto responseDto = new GetHotelByIdResponseDto();

        responseDto.setId(hotel.getId());
        responseDto.setName(hotel.getName());
        responseDto.setDescription(hotel.getDescription());
        responseDto.setAddress(hotel.getAddress());
        responseDto.setRating(hotel.getRating());
        responseDto.setNumberOfRating(hotel.getNumberOfRating());
        responseDto.setActiveStatus(hotel.getActiveStatus().toString());
        responseDto.setCreatedAt(hotel.getCreatedAt());
        responseDto.setUpdatedAt(hotel.getUpdatedAt());

        List<Room> sortedRoomRespnseDto = hotel.getRooms().stream()
                .sorted(Comparator.comparingLong(Room::getId))
                .collect(Collectors.toList());

        // Khai báo một danh sách để lưu trữ RoomResponseDto
        List<RoomResponseDto> rooms = new ArrayList<>();

        // Lặp qua từng phòng trong danh sách phòng của khách sạn
        for (Room room : sortedRoomRespnseDto) {
            // Tạo một đối tượng RoomResponseDto mới
            RoomResponseDto roomDto = new RoomResponseDto();

            // Thiết lập thông tin cho roomDto từ room
            roomDto.setId(room.getId());
            roomDto.setRoomNumber(room.getRoomNumber());
            roomDto.setType(room.getType());
            roomDto.setPrice(room.getPrice());
            roomDto.setBookedStatus(room.getBookedStatus().toString());
            roomDto.setActiveStatus(room.getActiveStatus().toString());
            roomDto.setCreatedAt(room.getCreatedAt());

            // Khai báo một danh sách để lưu trữ URL hình ảnh
            List<String> imageUrls = new ArrayList<>();

            // Lặp qua từng hình ảnh của phòng
            for (RoomImage roomImage : room.getImages()) {
                // Lấy URL của hình ảnh và thêm vào danh sách imageUrls
                String imageUrl = roomImage.getImageUrl();
                imageUrls.add(imageUrl);
            }

            // Thiết lập danh sách imageUrls cho roomDto
            roomDto.setImageUrls(imageUrls);

            // Thêm roomDto vào danh sách rooms
            rooms.add(roomDto);
        }

        // Thiết lập danh sách rooms cho responseDto
        responseDto.setRooms(rooms);


        List<String> thumbnailUrls = new ArrayList<>();

        for (HotelImage hotelImage : hotel.getImages()) {
            thumbnailUrls.add(hotelImage.getImageUrl());
        }

        responseDto.setThumbnailUrls(thumbnailUrls);

        return responseDto;
    }

}
