package com.example.city_tours.service;

import com.example.city_tours.dto.request.Region.CreateRegionRequestDto;
import com.example.city_tours.dto.request.Region.UpdateRegionRequestDto;
import com.example.city_tours.dto.request.Transaction.CreateTransactionRequestDto;
import com.example.city_tours.dto.response.Region.CreateRegionResponseDto;
import com.example.city_tours.dto.response.Region.GetAllRegionsResponseDto;
import com.example.city_tours.dto.response.Region.GetRegionByIdResponseDto;
import com.example.city_tours.dto.response.Region.UpdateRegionResponseDto;
import com.example.city_tours.dto.response.Transaction.CreateTransactionResponseDto;
import com.example.city_tours.dto.response.Transaction.GetAllTransactionsResponseDto;
import jakarta.transaction.Transactional;

import java.util.List;

public interface RegionService {

    CreateRegionResponseDto createRegion(CreateRegionRequestDto createRegionRequestDto);

    GetRegionByIdResponseDto getRegionById(Long regionId);
    List<GetAllRegionsResponseDto> getAllRegions(int page, int limit);
    UpdateRegionResponseDto updateRegion(Long regionId, UpdateRegionRequestDto updateRegionRequestDto);

//    UpdateAccountResponseDto updateAccount(Long userId, UpdateAccountRequestDto updateAccountRequestDto);
//    GetAccountByIdResponseDto getAccountById(Long userId);

//    void deleteAccount(Long userId);

}
