package com.example.city_tours.service;

import com.example.city_tours.dto.request.Region.CreateRegionRequestDto;
import com.example.city_tours.dto.response.Province.GetAllProvincesResponseDto;
import com.example.city_tours.dto.response.Province.GetProvinceByIdResponseDto;
import com.example.city_tours.dto.response.Region.CreateRegionResponseDto;
import com.example.city_tours.dto.response.Region.GetAllRegionsResponseDto;
import com.example.city_tours.dto.response.Region.GetRegionByIdResponseDto;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

public interface ProvinceService {


//    CreateRegionResponseDto createRegion(CreateRegionRequestDto createRegionRequestDto);
//    GetRegionByIdResponseDto getRegionById(Long regionId);
    List<GetAllProvincesResponseDto> getAllProvinces(int page, int limit);
    GetProvinceByIdResponseDto getProvinceById(Long provinceId);

//    UpdateAccountResponseDto updateAccount(Long userId, UpdateAccountRequestDto updateAccountRequestDto);
//    GetAccountByIdResponseDto getAccountById(Long userId);

//    void deleteAccount(Long userId);

}
