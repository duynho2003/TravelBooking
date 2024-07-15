package com.example.city_tours.service;

import com.example.city_tours.dto.request.Province.CreateProvinceRequestDto;
import com.example.city_tours.dto.request.Region.CreateRegionRequestDto;
import com.example.city_tours.dto.response.Hotel.GetHotelByIdResponseDto;
import com.example.city_tours.dto.response.Province.CreateProvinceResponseDto;
import com.example.city_tours.dto.response.Province.GetAllProvincesResponseDto;
import com.example.city_tours.dto.response.Province.GetProvinceByIdResponseDto;
import com.example.city_tours.dto.response.Region.CreateRegionResponseDto;
import com.example.city_tours.dto.response.Region.GetAllRegionsResponseDto;
import com.example.city_tours.dto.response.Region.GetRegionByIdResponseDto;
import com.example.city_tours.dto.response.Room.RoomResponseDto;
import com.example.city_tours.dto.response.Tour.GetTourRoomBookingResponseDto;
import com.example.city_tours.entity.*;
import com.example.city_tours.exception.ResourceNotFoundException;
import com.example.city_tours.repository.ProvinceRepository;
import com.example.city_tours.repository.RegionRepository;
import com.example.city_tours.repository.TransactionRepository;
import com.example.city_tours.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class ProvinceServiceImpl implements ProvinceService{

    private final UserRepository userRepository;

    private final TransactionRepository transactionRepository;
    private final RegionRepository regionRepository;
    private final ProvinceRepository provinceRepository;

    @Override
    public GetProvinceByIdResponseDto getProvinceById(Long provinceId) {

        Optional<Province> provinceOptional = provinceRepository.findById(provinceId);

        if (!provinceOptional.isPresent()) {
            throw new ResourceNotFoundException("Province not found");
        }

        Province province = provinceOptional.get();

        GetProvinceByIdResponseDto responseDto = new GetProvinceByIdResponseDto();

        responseDto.setId(province.getId());
        responseDto.setName(province.getName());

        // Set hotels for the province
        Set<GetHotelByIdResponseDto> hotelsDto = province.getHotels().stream()
                .map(hotel -> {
                    GetHotelByIdResponseDto hotelDto = new GetHotelByIdResponseDto();
                    hotelDto.setId(hotel.getId());
                    hotelDto.setName(hotel.getName());
                    hotelDto.setDescription(hotel.getDescription());
                    hotelDto.setAddress(hotel.getAddress());
                    hotelDto.setRating(hotel.getRating());
                    hotelDto.setNumberOfRating(hotel.getNumberOfRating());
                    hotelDto.setActiveStatus(hotel.getActiveStatus().toString());
                    hotelDto.setCreatedAt(hotel.getCreatedAt());
                    hotelDto.setUpdatedAt(hotel.getUpdatedAt());

                    // Set rooms for the hotel
                    List<RoomResponseDto> roomsDto = hotel.getRooms().stream()
                            .map(room -> {
                                RoomResponseDto roomDto = new RoomResponseDto();
                                roomDto.setId(room.getId());
                                roomDto.setRoomNumber(room.getRoomNumber());
                                roomDto.setType(room.getType());
                                roomDto.setBasePrice(room.getBasePrice());
                                roomDto.setWeekendPrice(room.getWeekendPrice());
                                roomDto.setDiscount(room.getDiscount());
                                roomDto.setNumberOfResidents(room.getNumberOfResidents());
                                roomDto.setBookedStatus(room.getBookedStatus().toString());
                                roomDto.setActiveStatus(room.getActiveStatus().toString());
                                roomDto.setCreatedAt(room.getCreatedAt());

                                // Set imageUrls for the room
                                List<String> imageUrls = room.getImages().stream()
                                        .map(RoomImage::getImageUrl)
                                        .collect(Collectors.toList());
                                roomDto.setImageUrls(imageUrls);

                                // Set tour room bookings for the room (if needed)
                                // roomDto.setTourRoomBookings(...);

                                return roomDto;
                            })
                            .collect(Collectors.toList());

                    hotelDto.setRooms(roomsDto);

                    // Set thumbnailUrls for the hotel
                    List<String> thumbnailUrls = hotel.getImages().stream()
                            .map(HotelImage::getImageUrl)
                            .collect(Collectors.toList());
                    hotelDto.setThumbnailUrls(thumbnailUrls);

                    return hotelDto;
                })
                .collect(Collectors.toSet());

        responseDto.setHotels(hotelsDto);

        return responseDto;
    }

@Override
public List<GetAllProvincesResponseDto> getAllProvinces(int page, int limit) {
    // Calculate the offset based on page and limit
    int offset = (page - 1) * limit;

    // Fetch provinces from the repository with pagination
    Pageable pageable = PageRequest.of(page - 1, limit);
    Page<Province> provincePage = provinceRepository.findAll(pageable);

    // Retrieve the content from the fetched page
    List<Province> provinces = provincePage.getContent();

    // Check if the fetched list of provinces is empty
    if (provinces.isEmpty()) {
        throw new ResourceNotFoundException("No provinces found");
    }

    // Convert provinces to GetAllProvincesResponseDto
    List<GetAllProvincesResponseDto> responseDtoList = provinces.stream()
            .map(province -> {
                GetAllProvincesResponseDto responseDto = new GetAllProvincesResponseDto();

                responseDto.setId(province.getId());
                responseDto.setName(province.getName());
                responseDto.setThumbnail(province.getThumbnail());
                responseDto.setQuantityHotels(province.getHotels().size());

                // Set hotels for the province
                Set<GetHotelByIdResponseDto> hotelsDto = province.getHotels().stream()
                        .map(hotel -> {
                            GetHotelByIdResponseDto hotelDto = new GetHotelByIdResponseDto();
                            hotelDto.setId(hotel.getId());
                            hotelDto.setName(hotel.getName());
                            hotelDto.setDescription(hotel.getDescription());
                            hotelDto.setAddress(hotel.getAddress());
                            hotelDto.setRating(hotel.getRating());
                            hotelDto.setNumberOfRating(hotel.getNumberOfRating());
                            hotelDto.setActiveStatus(hotel.getActiveStatus().toString());
                            hotelDto.setCreatedAt(hotel.getCreatedAt());
                            hotelDto.setUpdatedAt(hotel.getUpdatedAt());

                            // Set rooms for the hotel
                            List<RoomResponseDto> roomsDto = hotel.getRooms().stream()
                                    .map(room -> {
                                        RoomResponseDto roomDto = new RoomResponseDto();
                                        roomDto.setId(room.getId());
                                        roomDto.setRoomNumber(room.getRoomNumber());
                                        roomDto.setType(room.getType());
                                        roomDto.setBasePrice(room.getBasePrice());
                                        roomDto.setWeekendPrice(room.getWeekendPrice());
                                        roomDto.setDiscount(room.getDiscount());
                                        roomDto.setNumberOfResidents(room.getNumberOfResidents());
                                        roomDto.setBookedStatus(room.getBookedStatus().toString());
                                        roomDto.setActiveStatus(room.getActiveStatus().toString());
                                        roomDto.setCreatedAt(room.getCreatedAt());

                                        // Set imageUrls for the room
                                        List<String> imageUrls = room.getImages().stream()
                                                .map(RoomImage::getImageUrl)
                                                .collect(Collectors.toList());
                                        roomDto.setImageUrls(imageUrls);

                                        // Set tour room bookings for the room (if needed)
                                        // roomDto.setTourRoomBookings(...);

                                        return roomDto;
                                    })
                                    .collect(Collectors.toList());

                            hotelDto.setRooms(roomsDto);

                            // Set thumbnailUrls for the hotel
                            List<String> thumbnailUrls = hotel.getImages().stream()
                                    .map(HotelImage::getImageUrl)
                                    .collect(Collectors.toList());
                            hotelDto.setThumbnailUrls(thumbnailUrls);

                            return hotelDto;
                        })
                        .collect(Collectors.toSet());

                responseDto.setHotels(hotelsDto);

                return responseDto;
            })
            .collect(Collectors.toList());

    responseDtoList.sort(Comparator.comparingInt(GetAllProvincesResponseDto::getQuantityHotels).reversed());

    // Return the responseDtoList
    return responseDtoList;
}

}
