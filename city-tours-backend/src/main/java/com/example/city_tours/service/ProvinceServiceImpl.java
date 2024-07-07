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

//    @Override
//    public CreateRegionResponseDto createRegion(CreateRegionRequestDto requestDto) {
//
//        Region region = new Region();
//
//        region.setName(requestDto.getName());
//
//        Set<Province> provinces = new HashSet<>();
//
//        for (CreateProvinceRequestDto createProvinceRequestDto : requestDto.getProvinces()) {
//            Province province = new Province();
//
//            province.setName(createProvinceRequestDto.getName());
//            province.setThumbnail("123.jpg");
//
//            provinces.add(province);
//        }
//
//        region.setProvinces(provinces);
//
//        Region savedRegion = regionRepository.save(region);
//
//        CreateRegionResponseDto responseDto = new CreateRegionResponseDto();
//
//        responseDto.setId(savedRegion.getId());
//        responseDto.setName(savedRegion.getName());
//
//        Set<CreateProvinceResponseDto> provincesDto = new HashSet<>();
//
//        for (Province province : savedRegion.getProvinces()) {
//            CreateProvinceResponseDto createProvinceResponseDto = new CreateProvinceResponseDto();
//
//            createProvinceResponseDto.setId(province.getId());
//            createProvinceResponseDto.setName(province.getName());
//            createProvinceResponseDto.setThumbnail(province.getThumbnail());
//
//            provincesDto.add(createProvinceResponseDto);
//        }
//
//        responseDto.setProvinces(provincesDto);
//
//        return responseDto;
//    }

//    @Override
//    public GetRegionByIdResponseDto getRegionById(Long regionId) {
//
//        Optional<Region> optionalRegion = regionRepository.findById(regionId);
//
//        if (!optionalRegion.isPresent()) {
//            throw new ResourceNotFoundException("Region not found");
//        }
//
//        Region region = optionalRegion.get();
//
//        GetRegionByIdResponseDto responseDto = new GetRegionByIdResponseDto();
//
//        responseDto.setId(region.getId());
//        responseDto.setName(region.getName());
//
//        Set<CreateProvinceResponseDto> provincesDto = new HashSet<>();
//
//        for (Province province : region.getProvinces()) {
//            CreateProvinceResponseDto createProvinceResponseDto = new CreateProvinceResponseDto();
//
//            createProvinceResponseDto.setId(province.getId());
//            createProvinceResponseDto.setName(province.getName());
//            createProvinceResponseDto.setThumbnail(province.getThumbnail());
//
//            provincesDto.add(createProvinceResponseDto);
//        }
//
//        responseDto.setProvinces(provincesDto);
//
//        return responseDto;
//    }


//    @Override
//    public UpdateAccountResponseDto updateAccount(Long userId, UpdateAccountRequestDto updateAccountRequestDto) {
//
//        Optional<User> userOptional = userRepository.findById(userId);
//
//        if (!userOptional.isPresent()) {
//            throw new ResourceNotFoundException("User not found");
//        }
//
//        User user = userOptional.get();
//
//        user.setUsername(updateAccountRequestDto.getUsername());
//        user.setEmail(updateAccountRequestDto.getEmail());
//
//        if (updateAccountRequestDto.getStatus() != null) {
//            user.setStatus(UserStatus.valueOf(updateAccountRequestDto.getStatus().toUpperCase()));
//        } else {
//            throw new IllegalArgumentException("No enum");
//        }
//
//        user.setUpdatedAt(LocalDateTime.now());
//
//        Set<Role> roles = new HashSet<>();
//
//        for (String roleName : updateAccountRequestDto.getRoles()) {
//            Role role = roleRepository.findByName(roleName);
//
//            if (role == null) {
//                role = new Role();
//                role.setName(roleName);
//                roleRepository.save(role);
//            }
//
//            roles.add(role);
//        }
//
//        user.setRoles(roles);
//
//        userRepository.save(user);
//
//        UpdateAccountResponseDto responseDto = new UpdateAccountResponseDto();
//
//        responseDto.setId(user.getId());
//        responseDto.setUsername(user.getUsername());
//        responseDto.setEmail(user.getEmail());
//        responseDto.setRoles(user.getRoles().stream().map(Role::getName).collect(Collectors.toSet()));
//        responseDto.setStatus(user.getStatus().toString());
//        responseDto.setUpdatedAt(user.getUpdatedAt());
//
//        return responseDto;
//    }
//
//    @Override
//    public void deleteAccount(Long userId) {
//
//        Optional<User> userOptional = userRepository.findById(userId);
//
//        if (!userOptional.isPresent()) {
//            throw new ResourceNotFoundException("Account not found");
//        }
//
//        User user = userOptional.get();
//
//        user.setRoles(new HashSet<>());
//
//        userRepository.save(user);
//
//        userRepository.deleteById(userId);
//
//    }
//
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
                                roomDto.setPrice(room.getPrice());
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
                                        roomDto.setPrice(room.getPrice());
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
