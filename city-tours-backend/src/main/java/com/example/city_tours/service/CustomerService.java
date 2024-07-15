package com.example.city_tours.service;

import com.example.city_tours.dto.request.Customer.CreateCustomerRequestDto;
import com.example.city_tours.dto.request.Customer.UpdateCustomerRequestDto;
import com.example.city_tours.dto.request.User.CreateAccountRequestDto;
import com.example.city_tours.dto.request.User.UpdateAccountRequestDto;
import com.example.city_tours.dto.response.Customer.CreateCustomerResponseDto;
import com.example.city_tours.dto.response.Customer.UpdateCustomerResponseDto;
import com.example.city_tours.dto.response.User.CreateAccountResponseDto;
import com.example.city_tours.dto.response.User.GetAccountByIdResponseDto;
import com.example.city_tours.dto.response.User.GetAllAccountsResponseDto;
import com.example.city_tours.dto.response.User.UpdateAccountResponseDto;

import java.util.List;

public interface CustomerService {

    CreateCustomerResponseDto createCustomer(CreateCustomerRequestDto createCustomerRequestDto);
    UpdateCustomerResponseDto updateCustomer(Long userId, UpdateCustomerRequestDto updateCustomerRequestDto);
//    UpdateAccountResponseDto updateAccount(Long userId, UpdateAccountRequestDto updateAccountRequestDto);
//    GetAccountByIdResponseDto getAccountById(Long userId);
//    List<GetAllAccountsResponseDto> getAllAccounts(int page, int limit, String search, String role, String status);
//    void deleteAccount(Long userId);

}
