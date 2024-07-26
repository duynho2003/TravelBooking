package com.example.city_tours.service;

import com.example.city_tours.dto.request.Auth.LoginRequestDto;
import com.example.city_tours.dto.request.Auth.RegisterRequestDto;
import com.example.city_tours.dto.request.Auth.ResetPasswordRequestDto;
import com.example.city_tours.dto.request.Auth.UpdatePasswordRequestDto;
import com.example.city_tours.dto.response.Auth.LoginResponseDto;
import com.example.city_tours.dto.response.Auth.RegisterResponseDto;
import org.springframework.web.bind.annotation.RequestBody;

public interface AuthService {
    RegisterResponseDto register(RegisterRequestDto registerRequestDto);
    LoginResponseDto login(LoginRequestDto loginRequestDto);
    String confirmAccount(String token);
//    void requestPasswordReset(ResetPasswordRequestDto requestDto);
    void sendPasswordResetEmail(String email);
    void updatePassword(UpdatePasswordRequestDto updatePasswordRequestDto);

}
