package com.example.city_tours.service;

import com.example.city_tours.dto.request.Transaction.CreateTransactionRequestDto;
import com.example.city_tours.dto.request.User.CreateAccountRequestDto;
import com.example.city_tours.dto.request.User.UpdateAccountRequestDto;
import com.example.city_tours.dto.response.Transaction.CreateTransactionResponseDto;
import com.example.city_tours.dto.response.Transaction.GetAllTransactionsResponseDto;
import com.example.city_tours.dto.response.User.CreateAccountResponseDto;
import com.example.city_tours.dto.response.User.GetAccountByIdResponseDto;
import com.example.city_tours.dto.response.User.GetAllAccountsResponseDto;
import com.example.city_tours.dto.response.User.UpdateAccountResponseDto;

import java.util.List;

public interface TransactionService {

    CreateTransactionResponseDto createTransaction(CreateTransactionRequestDto createTransactionRequestDto);
//    UpdateAccountResponseDto updateAccount(Long userId, UpdateAccountRequestDto updateAccountRequestDto);
//    GetAccountByIdResponseDto getAccountById(Long userId);
    List<GetAllTransactionsResponseDto> getAllTransactions(int page, int limit, String search, String paymentStatus);
//    void deleteAccount(Long userId);

}
