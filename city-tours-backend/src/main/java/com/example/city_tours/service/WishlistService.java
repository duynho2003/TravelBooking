package com.example.city_tours.service;

import com.example.city_tours.dto.request.Customer.CreateCustomerRequestDto;
import com.example.city_tours.dto.request.Wishlist.CreateWishlistRequestDto;
import com.example.city_tours.dto.response.Customer.CreateCustomerResponseDto;
import com.example.city_tours.dto.response.User.PageResponseDto;
import com.example.city_tours.dto.response.Wishlist.CreateWishlistResponseDto;

public interface WishlistService {

    CreateWishlistResponseDto createWishlist(CreateWishlistRequestDto createWishlistRequestDto);
    PageResponseDto getAllWishlists(Long userId, int page, int limit);
    void deleteWishlist(Long wishlistId);

//    UpdateAccountResponseDto updateAccount(Long userId, UpdateAccountRequestDto updateAccountRequestDto);
//    GetAccountByIdResponseDto getAccountById(Long userId);
//    List<GetAllAccountsResponseDto> getAllAccounts(int page, int limit, String search, String role, String status);
//    void deleteAccount(Long userId);

}
