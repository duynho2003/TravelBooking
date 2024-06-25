package com.example.city_tours.service;

import com.example.city_tours.dto.request.Auth.LoginRequestDto;
import com.example.city_tours.dto.request.Auth.RegisterRequestDto;
import com.example.city_tours.dto.response.Auth.LoginResponseDto;
import com.example.city_tours.dto.response.Auth.RegisterResponseDto;

public interface AuthService {
    RegisterResponseDto register(RegisterRequestDto registerRequestDto);

    LoginResponseDto login(LoginRequestDto loginRequestDto);

//    void logout(String token);
}
