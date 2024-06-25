package com.example.city_tours.service;

import com.example.city_tours.dto.request.Website.CreateInfoRequestDto;
import com.example.city_tours.dto.request.Website.UpdateInfoRequestDto;
import com.example.city_tours.dto.response.Website.CreateInfoResponseDto;
import com.example.city_tours.dto.response.Website.GetInfoResponseDto;
import com.example.city_tours.dto.response.Website.UpdateInfoResponseDto;

public interface WebsiteService {
    CreateInfoResponseDto createInfo(CreateInfoRequestDto createInfoRequestDto);
    UpdateInfoResponseDto updateInfo(Long websiteInfoId, UpdateInfoRequestDto websiteUpdateInfoRequestDto);
    GetInfoResponseDto getInfo(Long websiteInfoId);
}
