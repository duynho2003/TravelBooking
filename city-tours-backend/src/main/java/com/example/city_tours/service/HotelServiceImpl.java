package com.example.city_tours.service;

import com.example.city_tours.dto.request.Hotel.CreateHotelRequestDto;
import com.example.city_tours.dto.request.Hotel.UpdateHotelRequestDto;
import com.example.city_tours.dto.response.Hotel.CreateHotelResponseDto;
import com.example.city_tours.dto.response.Hotel.GetAllHotelsResponseDto;
import com.example.city_tours.dto.response.Hotel.GetHotelByIdResponseDto;
import com.example.city_tours.dto.response.Hotel.UpdateHotelResponseDto;
import com.example.city_tours.dto.response.Room.RoomResponseDto;
import com.example.city_tours.dto.response.RoomHoliday.CreateRoomHolidayResponseDto;
import com.example.city_tours.dto.response.RoomHoliday.GetAllRoomHolidaysResponseDto;
import com.example.city_tours.dto.response.RoomView.GetARoomViewResponseDto;
import com.example.city_tours.dto.response.Tour.GetAllToursResponseDto;
import com.example.city_tours.dto.response.Tour.GetTourRoomBookingResponseDto;
import com.example.city_tours.dto.response.User.PageResponseDto;
import com.example.city_tours.entity.*;
import com.example.city_tours.enums.ActiveStatus;
import com.example.city_tours.exception.ResourceNotFoundException;
import com.example.city_tours.repository.*;
import jakarta.persistence.criteria.Predicate;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class HotelServiceImpl implements HotelService{

    private final HotelRepository hotelRepository;
    private final HotelImageRepository hotelImageRepository;
    private final TourRoomBookingRepository tourRoomBookingRepository;
    private final ProvinceRepository provinceRepository;

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

        Optional<Province> optionalProvince = provinceRepository.findById(requestDto.getProvinceId());

        if (!optionalProvince.isPresent()) {
            throw new ResourceNotFoundException("Province not found");
        }

        Province province = optionalProvince.get();

        hotel.setProvince(province);

        Hotel savedHotel = hotelRepository.save(hotel);

        Set<HotelImage> hotelImages = new HashSet<>();

        for (String imageUrl : requestDto.getThumbnailUrls()) {
            HotelImage hotelImage = new HotelImage();

            hotelImage.setHotel(savedHotel);
            hotelImage.setImageUrl(imageUrl);

            hotelImages.add(hotelImage);
        }

        hotelImageRepository.saveAll(hotelImages);

        province.setQuantityHotel(province.getQuantityHotel() + 1);
        provinceRepository.save(province);

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

    @Override
    public PageResponseDto getAllHotels(int page, int limit, String search, String review, String rating) {

        Specification<Hotel> spec = (root, query, cb) -> {
            Predicate predicate = cb.conjunction(); // Start with an "AND" conjunction

            // Add condition to search for username or email if search parameter is provided
            if (search != null && !search.isEmpty()) {
                Predicate namePredicate = cb.like(cb.lower(root.get("name")), "%" + search.toLowerCase() + "%");
                Predicate addressPredicate = cb.like(cb.lower(root.get("address")), "%" + search.toLowerCase() + "%");
                predicate = cb.or(namePredicate, addressPredicate);
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

        System.out.println("pageable: " + pageable);

        Page<Hotel> hotelPage = hotelRepository.findAll(spec, pageable);

        long totalHotels = hotelPage.getTotalElements();

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
                roomDto.setWeekendPrice(room.getWeekendPrice());
                roomDto.setDiscount(room.getDiscount());
                roomDto.setQuantityAdult(room.getQuantityAdult());
                roomDto.setQuantityChild(room.getQuantityChild());
                roomDto.setBookedStatus(room.getBookedStatus().toString());
                roomDto.setActiveStatus(room.getActiveStatus().toString());
                roomDto.setCreatedAt(room.getCreatedAt());

                List<GetAllRoomHolidaysResponseDto> roomHolidayResponseDtos = new ArrayList<>();
                for (RoomHoliday roomHoliday : room.getRoomHolidays()) {
                    GetAllRoomHolidaysResponseDto roomHolidayDto = new GetAllRoomHolidaysResponseDto();
                    roomHolidayDto.setId(roomHoliday.getId());
                    roomHolidayDto.setDate(roomHoliday.getDate());
                    roomHolidayDto.setPrice(roomHoliday.getPrice());
                    roomHolidayResponseDtos.add(roomHolidayDto);
                }
                roomDto.setRoomHolidays(roomHolidayResponseDtos);

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
                roomDto.setTourRoomBookings(tourRoomBookingDtos);

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

            responseDtoList.add(responseDto);
        }

        // Calculate skip (number of records skipped)
        int skip = (page - 1) * limit;

        // Prepare the response structure
        PageResponseDto<GetAllHotelsResponseDto> pageResponseDto = new PageResponseDto<>();
        pageResponseDto.setData(responseDtoList);
        pageResponseDto.setPage(page);
        pageResponseDto.setLimit(limit);
        pageResponseDto.setSkip(skip);
        pageResponseDto.setTotals(totalHotels);

        // Return the responseDtoList
        return pageResponseDto;
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
        responseDto.setProvinceName(hotel.getProvince().getName());
        responseDto.setRegionName(hotel.getProvince().getRegion().getName());

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
            roomDto.setCategory(room.getCategory());
            roomDto.setDefaultPrice(room.getDefaultPrice());
            roomDto.setWeekdayPrice(room.getWeekdayPrice());
            roomDto.setWeekendPrice(room.getWeekendPrice());
            roomDto.setDiscount(room.getDiscount());
            roomDto.setQuantityAdult(room.getQuantityAdult());
            roomDto.setQuantityChild(room.getQuantityChild());
            roomDto.setChildCharge(room.getChildCharge());
            roomDto.setQuantityBaby(room.getQuantityBaby());
            roomDto.setBabyCharge(room.getBabyCharge());
            roomDto.setBookedStatus(room.getBookedStatus().toString());
            roomDto.setActiveStatus(room.getActiveStatus().toString());
            roomDto.setCreatedAt(room.getCreatedAt());

            List<GetARoomViewResponseDto> roomViewResponseDtos = new ArrayList<>();
            for (RoomView roomView : room.getRoomViews()) {
                GetARoomViewResponseDto roomViewDto = new GetARoomViewResponseDto();
                roomViewDto.setId(roomView.getId());
                roomViewDto.setName(roomView.getName());
                roomViewDto.setImages(roomView.getImages());
                roomViewResponseDtos.add(roomViewDto);
            }
            roomDto.setRoomViews(roomViewResponseDtos);

            List<GetAllRoomHolidaysResponseDto> roomHolidayResponseDtos = new ArrayList<>();
            for (RoomHoliday roomHoliday : room.getRoomHolidays()) {
                GetAllRoomHolidaysResponseDto roomHolidayDto = new GetAllRoomHolidaysResponseDto();
                roomHolidayDto.setId(roomHoliday.getId());
                roomHolidayDto.setDate(roomHoliday.getDate());
                roomHolidayDto.setPrice(roomHoliday.getPrice());
                roomHolidayResponseDtos.add(roomHolidayDto);
            }
            roomDto.setRoomHolidays(roomHolidayResponseDtos);

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
            roomDto.setTourRoomBookings(tourRoomBookingDtos);

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
