package com.example.city_tours.service;

import com.example.city_tours.dto.request.Province.CreateProvinceRequestDto;
import com.example.city_tours.dto.request.Region.CreateRegionRequestDto;
import com.example.city_tours.dto.request.Region.UpdateRegionRequestDto;
import com.example.city_tours.dto.response.Province.CreateProvinceResponseDto;
import com.example.city_tours.dto.response.Region.CreateRegionResponseDto;
import com.example.city_tours.dto.response.Region.GetAllRegionsResponseDto;
import com.example.city_tours.dto.response.Region.GetRegionByIdResponseDto;
import com.example.city_tours.dto.response.Region.UpdateRegionResponseDto;
import com.example.city_tours.entity.*;
import com.example.city_tours.exception.ResourceNotFoundException;
import com.example.city_tours.repository.*;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class RegionServiceImpl implements RegionService{

    private final UserRepository userRepository;
    private final TransactionRepository transactionRepository;
    private final RegionRepository regionRepository;
    private final HotelRepository hotelRepository;
    private final ProvinceRepository provinceRepository;

    @Override
    public CreateRegionResponseDto createRegion(CreateRegionRequestDto requestDto) {

        Region region = new Region();

        region.setName(requestDto.getName());

        Region savedRegion = regionRepository.save(region);

        Set<Province> provinces = new HashSet<>();

        for (CreateProvinceRequestDto createProvinceRequestDto : requestDto.getProvinces()) {
            Province province = new Province();

            province.setName(createProvinceRequestDto.getName());
            province.setThumbnail("123.jpg");

            province.setRegion(savedRegion);

            provinces.add(province);
        }

        // Lưu danh sách Province vào cơ sở dữ liệu
        Set<Province> persistedProvinces = new HashSet<>(provinceRepository.saveAll(provinces));

        // Cập nhật lại danh sách Province đã lưu vào Region
        savedRegion.setProvinces(persistedProvinces);

        // Lưu lại Region sau khi cập nhật danh sách Province
        regionRepository.save(savedRegion);

        CreateRegionResponseDto responseDto = new CreateRegionResponseDto();

        responseDto.setId(savedRegion.getId());
        responseDto.setName(savedRegion.getName());

        Set<CreateProvinceResponseDto> provincesDto = new HashSet<>();

        for (Province province : savedRegion.getProvinces()) {
            CreateProvinceResponseDto createProvinceResponseDto = new CreateProvinceResponseDto();

            createProvinceResponseDto.setId(province.getId());
            createProvinceResponseDto.setName(province.getName());
            createProvinceResponseDto.setThumbnail(province.getThumbnail());

            provincesDto.add(createProvinceResponseDto);
        }

        responseDto.setProvinces(provincesDto);

        return responseDto;
    }

    @Override
    public UpdateRegionResponseDto updateRegion(Long regionId, UpdateRegionRequestDto requestDto) {
        Optional<Region> optionalRegion = regionRepository.findById(regionId);

        if (!optionalRegion.isPresent()) {
            throw new ResourceNotFoundException("Region not found");
        }

        Region region = optionalRegion.get();

        region.setName(requestDto.getName());

        Region savedRegion = regionRepository.save(region);

        Set<Province> provinces = new HashSet<>();

        for (CreateProvinceRequestDto createProvinceRequestDto : requestDto.getProvinces()) {
            Province province = new Province();

            province.setName(createProvinceRequestDto.getName());
            province.setThumbnail("123.jpg");
            province.setRegion(savedRegion);

            provinces.add(province);
        }

        // Save all new provinces
        Set<Province> savedProvinces = new HashSet<>(provinceRepository.saveAll(provinces));

        // Update the region's provinces
        savedRegion.setProvinces(savedProvinces);

        UpdateRegionResponseDto responseDto = new UpdateRegionResponseDto();

        responseDto.setId(savedRegion.getId());
        responseDto.setName(savedRegion.getName());

        Set<CreateProvinceResponseDto> provincesDto = new HashSet<>();

        for (Province province : savedRegion.getProvinces()) {
            CreateProvinceResponseDto createProvinceResponseDto = new CreateProvinceResponseDto();

            createProvinceResponseDto.setId(province.getId());
            createProvinceResponseDto.setName(province.getName());
            createProvinceResponseDto.setThumbnail(province.getThumbnail());

            provincesDto.add(createProvinceResponseDto);
        }

        responseDto.setProvinces(provincesDto);

        return responseDto;
    }

    @Override
    public GetRegionByIdResponseDto getRegionById(Long regionId) {

        Optional<Region> optionalRegion = regionRepository.findById(regionId);

        if (!optionalRegion.isPresent()) {
            throw new ResourceNotFoundException("Region not found");
        }

        Region region = optionalRegion.get();

        GetRegionByIdResponseDto responseDto = new GetRegionByIdResponseDto();

        responseDto.setId(region.getId());
        responseDto.setName(region.getName());

        Set<CreateProvinceResponseDto> provincesDto = new HashSet<>();

        for (Province province : region.getProvinces()) {
            CreateProvinceResponseDto createProvinceResponseDto = new CreateProvinceResponseDto();

            createProvinceResponseDto.setId(province.getId());
            createProvinceResponseDto.setName(province.getName());
            createProvinceResponseDto.setThumbnail(province.getThumbnail());

            provincesDto.add(createProvinceResponseDto);
        }

        responseDto.setProvinces(provincesDto);

        return responseDto;
    }


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
//    @Override
//    public GetAccountByIdResponseDto getAccountById(Long userId) {
//
//        Optional<User> userOptional = userRepository.findById(userId);
//
//        if (!userOptional.isPresent()) {
//            throw new ResourceNotFoundException("User not found");
//        }
//
//        User user = userOptional.get();
//
//        GetAccountByIdResponseDto responseDto = new GetAccountByIdResponseDto();
//
//        responseDto.setId(user.getId());
//        responseDto.setUsername(user.getUsername());
//        responseDto.setPassword(user.getPassword());
//        responseDto.setEmail(user.getEmail());
//        responseDto.setRoles(user.getRoles().stream().map(Role::getName).collect(Collectors.toSet()));
//        responseDto.setStatus(user.getStatus().toString());
//        responseDto.setCreateAt(user.getCreatedAt());
//        responseDto.setUpdatedAt(user.getUpdatedAt());
//
//        return responseDto;
//    }
//
    @Override
    public List<GetAllRegionsResponseDto> getAllRegions(int page, int limit) {
        // Calculate the offset based on page and limit
        int offset = (page - 1) * limit;

        // Fetch users from the repository with pagination
        Pageable pageable = PageRequest.of(page - 1, limit);

        // Fetch users from the repository with pagination and dynamic query
        Page<Region> regionPage = regionRepository.findAll(pageable);

        // Retrieve the content from the fetched page
        List<Region> regions = regionPage.getContent();

        // Check if the fetched list of users is empty
        if (regions.isEmpty()) {
            throw new ResourceNotFoundException("No regions found");
        }

        // Convert users to GetAllAccountsResponseDto
        List<GetAllRegionsResponseDto> responseDtoList = regions.stream()
                .map(region -> {
                    GetAllRegionsResponseDto responseDto = new GetAllRegionsResponseDto();

                    responseDto.setId(region.getId());
                    responseDto.setName(region.getName());

                    Set<CreateProvinceResponseDto> provincesDto = new HashSet<>();

                    for (Province province : region.getProvinces()) {
                        CreateProvinceResponseDto createProvinceResponseDto = new CreateProvinceResponseDto();

                        createProvinceResponseDto.setId(province.getId());
                        createProvinceResponseDto.setName(province.getName());
                        createProvinceResponseDto.setThumbnail(province.getThumbnail());
                        createProvinceResponseDto.setQuantityHotel(province.getHotels().size());

                        provincesDto.add(createProvinceResponseDto);
                    }

                    responseDto.setProvinces(provincesDto);

                    return responseDto;
                })
                .collect(Collectors.toList());

        // Return the responseDtoList
        return responseDtoList;
    }
}
