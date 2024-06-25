package com.example.city_tours.service;

import com.example.city_tours.dto.request.Website.CreateInfoRequestDto;
import com.example.city_tours.dto.request.Website.UpdateInfoRequestDto;
import com.example.city_tours.dto.response.Website.CreateInfoResponseDto;
import com.example.city_tours.dto.response.Website.GetInfoResponseDto;
import com.example.city_tours.dto.response.Website.UpdateInfoResponseDto;
import com.example.city_tours.entity.Website;
import com.example.city_tours.exception.ResourceNotFoundException;
import com.example.city_tours.repository.WebsiteRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
@AllArgsConstructor
public class WebsiteServiceImpl implements WebsiteService{

    private final WebsiteRepository websiteRepository;

    private final CloudinaryService cloudinaryService;

    @Override
    public GetInfoResponseDto getInfo(Long websiteInfo) {
        Optional<Website> websiteOptional = websiteRepository.findById(websiteInfo);

        if (!websiteOptional.isPresent()) {
            throw new ResourceNotFoundException("Website not found");
        }

        Website website = websiteOptional.get();

        GetInfoResponseDto getInfoResponseDto = new GetInfoResponseDto();

        getInfoResponseDto.setId(website.getId());
        getInfoResponseDto.setName(website.getName());
        getInfoResponseDto.setLogo(website.getLogo());
        getInfoResponseDto.setEmail(website.getEmail());
        getInfoResponseDto.setPhone(website.getPhone());
        getInfoResponseDto.setAddress(website.getAddress());
        getInfoResponseDto.setWorkingDate(website.getWorkingDate());
        getInfoResponseDto.setCreatedAt(website.getCreatedAt());
        getInfoResponseDto.setUpdatedAt(website.getUpdatedAt());

        return getInfoResponseDto;
    }

    @Override
    public CreateInfoResponseDto createInfo(CreateInfoRequestDto createInfoRequestDto) {
        String imageUrl = this.cloudinaryService.uploadAndGetUrl(createInfoRequestDto.getLogo());

        Website website = new Website();

        website.setName(createInfoRequestDto.getName());
        website.setLogo(imageUrl);
        website.setEmail(createInfoRequestDto.getEmail());
        website.setPhone(createInfoRequestDto.getPhone());
        website.setAddress(createInfoRequestDto.getAddress());
        website.setWorkingDate(createInfoRequestDto.getWorkingDate());
        website.setCreatedAt(LocalDateTime.now());
        website.setUpdatedAt(LocalDateTime.now());

        websiteRepository.save(website);

        CreateInfoResponseDto responseDto = new CreateInfoResponseDto();

        responseDto.setId(website.getId());
        responseDto.setName(website.getName());
        responseDto.setLogo(website.getLogo());
        responseDto.setEmail(website.getEmail());
        responseDto.setPhone(website.getPhone());
        responseDto.setAddress(website.getAddress());
        responseDto.setWorkingDate(website.getWorkingDate());
        responseDto.setCreatedAt(website.getCreatedAt());

        return responseDto;
    }

    @Override
    public UpdateInfoResponseDto updateInfo(Long websiteInfo, UpdateInfoRequestDto websiteUpdateInfoRequestDto) {
        String imageUrl = this.cloudinaryService.uploadAndGetUrl(websiteUpdateInfoRequestDto.getLogo());

        Optional<Website> websiteOptional = websiteRepository.findById(websiteInfo);

        if (!websiteOptional.isPresent()) {
            throw new ResourceNotFoundException("Website not found");
        }

        Website website = websiteOptional.get();

        website.setName(websiteUpdateInfoRequestDto.getName());
        website.setLogo(imageUrl);
        website.setEmail(websiteUpdateInfoRequestDto.getEmail());
        website.setPhone(websiteUpdateInfoRequestDto.getPhone());
        website.setAddress(websiteUpdateInfoRequestDto.getAddress());
        website.setWorkingDate(websiteUpdateInfoRequestDto.getWorkingDate());
        website.setUpdatedAt(LocalDateTime.now());

        websiteRepository.save(website);

        UpdateInfoResponseDto updateInfoResponseDto = new UpdateInfoResponseDto();

        updateInfoResponseDto.setId(website.getId());
        updateInfoResponseDto.setName(website.getName());
        updateInfoResponseDto.setLogo(website.getLogo());
        updateInfoResponseDto.setEmail(website.getEmail());
        updateInfoResponseDto.setPhone(website.getPhone());
        updateInfoResponseDto.setAddress(website.getAddress());
        updateInfoResponseDto.setWorkingDate(website.getWorkingDate());
        updateInfoResponseDto.setUpdatedAt(website.getUpdatedAt());

        return updateInfoResponseDto;
    }

}
