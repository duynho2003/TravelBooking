package com.example.city_tours.service;

import com.example.city_tours.dto.request.User.CreateAccountRequestDto;
import com.example.city_tours.dto.request.User.UpdateAccountRequestDto;
import com.example.city_tours.dto.response.User.*;

import java.util.List;

public interface UserService {

    CreateAccountResponseDto createAccount(CreateAccountRequestDto createAccountRequestDto);
    UpdateAccountResponseDto updateAccount(Long userId, UpdateAccountRequestDto updateAccountRequestDto);
    GetAccountByIdResponseDto getAccountById(Long userId);
    List<GetAllAccountsResponseDto> getAllAccounts(int page, int limit, String search, String role, String status);
    void deleteAccount(Long userId);

}
