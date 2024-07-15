package com.example.city_tours.service;

import com.example.city_tours.dto.request.Wishlist.CreateWishlistRequestDto;
import com.example.city_tours.dto.response.User.PageResponseDto;
import com.example.city_tours.dto.response.Wishlist.CreateWishlistResponseDto;
import com.example.city_tours.dto.response.Wishlist.GetAllWishlistsResponseDto;
import com.example.city_tours.entity.*;
import com.example.city_tours.exception.ResourceNotFoundException;
import com.example.city_tours.repository.UserRepository;
import com.example.city_tours.repository.WishlistRepository;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class WishlistServiceImpl implements WishlistService{

    private final UserRepository userRepository;
    private final WishlistRepository wishlistRepository;

    @Override
    public PageResponseDto getAllWishlists(Long userId, int page, int limit) {

        Optional<User> optionalUser = userRepository.findById(userId);

        if (!optionalUser.isPresent()) {
            throw new ResourceNotFoundException("User not found");
        }

        Pageable pageable = PageRequest.of(page - 1, limit);

        Page<Wishlist> wishlistPage = wishlistRepository.findAllByUserId(userId, pageable);

        long totalWishlists = wishlistPage.getTotalElements();

        List<Wishlist> wishlists = wishlistPage.getContent();

        if (wishlists.isEmpty()) {
            throw new ResourceNotFoundException("No wishlists found");
        }

        List<GetAllWishlistsResponseDto> responseDtoList = new ArrayList<>();

        // Convert tours to GetAllAccountsResponseDto
        for (Wishlist wishlist : wishlists) {
            GetAllWishlistsResponseDto responseDto = new GetAllWishlistsResponseDto();

            responseDto.setId(wishlist.getId());
            responseDto.setName(wishlist.getName());
            responseDto.setRating(wishlist.getRating());
            responseDto.setNumberOfRating(wishlist.getNumberOfRating());
            responseDto.setPrice(wishlist.getPrice());
            responseDto.setDescription(wishlist.getDescription());
            responseDto.setThumbnail(wishlist.getThumbnail());
            responseDto.setType(wishlist.getType());
            responseDto.setItemId(wishlist.getItemId());
            responseDto.setUserId(wishlist.getUser().getId());
            responseDto.setCreatedAt(wishlist.getCreatedAt());
            responseDto.setUpdatedAt(wishlist.getUpdatedAt());

            responseDtoList.add(responseDto);
        }

        int skip = (page - 1) * limit;

        PageResponseDto<GetAllWishlistsResponseDto> pageResponseDto = new PageResponseDto<>();

        pageResponseDto.setData(responseDtoList);
        pageResponseDto.setPage(page);
        pageResponseDto.setLimit(limit);
        pageResponseDto.setSkip(skip);
        pageResponseDto.setTotals(totalWishlists);

        return pageResponseDto;
    }

    @Override
    public CreateWishlistResponseDto createWishlist(CreateWishlistRequestDto requestDto) {

        Optional<User> optionalUser = userRepository.findById(requestDto.getUserId());

        if (!optionalUser.isPresent()) {
            throw new ResourceNotFoundException("User not found");
        }

        User user = optionalUser.get();

        Wishlist existingWishlist = wishlistRepository.findByName(requestDto.getName());

        if (existingWishlist != null) {
            throw new ResourceNotFoundException("Wishlist already exists");
        }

        Wishlist wishlist = new Wishlist();

        wishlist.setName(requestDto.getName());
        wishlist.setRating(requestDto.getRating());
        wishlist.setNumberOfRating(requestDto.getNumberOfRating());
        wishlist.setPrice(requestDto.getPrice());
        wishlist.setDescription(requestDto.getDescription());
        wishlist.setThumbnail(requestDto.getThumbnail());
        wishlist.setType(requestDto.getType());
        wishlist.setItemId(requestDto.getItemId());
        wishlist.setCreatedAt(LocalDateTime.now());
        wishlist.setUpdatedAt(LocalDateTime.now());

        wishlist.setUser(user);

        Wishlist savedWishlist = wishlistRepository.save(wishlist);

        CreateWishlistResponseDto responseDto = new CreateWishlistResponseDto();

        responseDto.setId(savedWishlist.getId());
        responseDto.setName(savedWishlist.getName());
        responseDto.setRating(savedWishlist.getRating());
        responseDto.setNumberOfRating(savedWishlist.getNumberOfRating());
        responseDto.setPrice(savedWishlist.getPrice());
        responseDto.setDescription(savedWishlist.getDescription());
        responseDto.setThumbnail(savedWishlist.getThumbnail());
        responseDto.setType(savedWishlist.getType());
        responseDto.setItemId(savedWishlist.getId());
        responseDto.setUserId(savedWishlist.getUser().getId());
        responseDto.setCreatedAt(savedWishlist.getCreatedAt());

        return responseDto;
    }

    @Override
    public void deleteWishlist(Long wishlistId) {

        Optional<Wishlist> optionalWishlist = wishlistRepository.findById(wishlistId);

        if (!optionalWishlist.isPresent()) {
            throw new ResourceNotFoundException("Wishlist not found");
        }

        wishlistRepository.deleteById(wishlistId);

    }

}
