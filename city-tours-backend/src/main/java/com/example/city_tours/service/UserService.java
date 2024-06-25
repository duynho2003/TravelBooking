package com.example.city_tours.service;

import com.example.city_tours.dto.request.User.ChangeStatusAccountRequestDto;
import com.example.city_tours.dto.request.User.CreateAccountRequestDto;
import com.example.city_tours.dto.request.User.UpdateAccountRequestDto;
import com.example.city_tours.dto.response.User.*;
import org.springframework.data.domain.Page;

import java.util.List;

public interface UserService {

    CreateAccountResponseDto createAccount(CreateAccountRequestDto createAccountRequestDto);
    UpdateAccountResponseDto updateAccount(Long userId, UpdateAccountRequestDto updateAccountRequestDto);
    ChangeStatusAccountResponseDto changeStatusAccount(Long userId, ChangeStatusAccountRequestDto changeStatusAccountRequestDto);
    GetAccountByIdResponseDto getAccountById(Long userId);
    Page<GetAllAccountsResponseDto> getAllAccounts(int page, int limit, int skip);

}
