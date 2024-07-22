package com.example.city_tours.service;

import com.example.city_tours.dto.request.Blog.CreateBlogRequestDto;
import com.example.city_tours.dto.request.Blog.UpdateBlogRequestDto;
import com.example.city_tours.dto.request.Tour.CreateTourRequestDto;
import com.example.city_tours.dto.request.Tour.UpdateTourRequestDto;
import com.example.city_tours.dto.response.Blog.CreateBlogResponseDto;
import com.example.city_tours.dto.response.Blog.GetBlogByIdResponseDto;
import com.example.city_tours.dto.response.Blog.UpdateBlogResponseDto;
import com.example.city_tours.dto.response.Tour.CreateTourResponseDto;
import com.example.city_tours.dto.response.Tour.GetTourByIdResponseDto;
import com.example.city_tours.dto.response.Tour.UpdateTourResponseDto;
import com.example.city_tours.dto.response.User.PageResponseDto;

public interface BlogService {

    CreateBlogResponseDto createBlog(CreateBlogRequestDto createBlogRequestDto);
    UpdateBlogResponseDto updateBlog(Long blogId, UpdateBlogRequestDto updateBlogRequestDto);
    void deleteBlog(Long blogId);
    PageResponseDto getAllBlogs(int page, int limit);
    GetBlogByIdResponseDto getBlogById(Long blogId);

//    CreateTourResponseDto createTour(CreateTourRequestDto createTourRequestDto);
//
//    UpdateTourResponseDto updateTour(Long tourId, UpdateTourRequestDto updateTourRequestDto);
//
//    void deleteTour(Long tourId);
//

//
//    GetTourByIdResponseDto getTourById(Long tourId);

//    UpdateTourResponseDto updateTour(Long tourId, UpdateTourRequestDto updateTourRequestDto);

}
