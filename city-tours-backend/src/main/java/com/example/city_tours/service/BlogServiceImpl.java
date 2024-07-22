package com.example.city_tours.service;

import com.example.city_tours.dto.request.Blog.CreateBlogRequestDto;
import com.example.city_tours.dto.request.Blog.UpdateBlogRequestDto;
import com.example.city_tours.dto.request.Tour.CreateTourRequestDto;
import com.example.city_tours.dto.request.Tour.UpdateTourRequestDto;
import com.example.city_tours.dto.request.TourLocation.CreateTourLocationRequestDto;
import com.example.city_tours.dto.request.TourLocation.UpdateTourLocationRequestDto;
import com.example.city_tours.dto.request.TourTime.CreateTourTimeRequestDto;
import com.example.city_tours.dto.request.TourTime.UpdateTourTimeRequestDto;
import com.example.city_tours.dto.response.Blog.CreateBlogResponseDto;
import com.example.city_tours.dto.response.Blog.GetAllBlogsResponseDto;
import com.example.city_tours.dto.response.Blog.GetBlogByIdResponseDto;
import com.example.city_tours.dto.response.Blog.UpdateBlogResponseDto;
import com.example.city_tours.dto.response.Tour.CreateTourResponseDto;
import com.example.city_tours.dto.response.Tour.GetAllToursResponseDto;
import com.example.city_tours.dto.response.Tour.GetTourByIdResponseDto;
import com.example.city_tours.dto.response.Tour.UpdateTourResponseDto;
import com.example.city_tours.dto.response.TourLocation.GetATourLocationResponseDto;
import com.example.city_tours.dto.response.TourTime.GetATourTimeResponseDto;
import com.example.city_tours.dto.response.User.PageResponseDto;
import com.example.city_tours.entity.*;
import com.example.city_tours.enums.ActiveStatus;
import com.example.city_tours.enums.BookedStatus;
import com.example.city_tours.exception.ResourceCanNotBeDeletedException;
import com.example.city_tours.exception.ResourceNotFoundException;
import com.example.city_tours.repository.*;
import jakarta.persistence.criteria.Predicate;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
@AllArgsConstructor
public class BlogServiceImpl implements BlogService{

    private final BlogRepository blogRepository;
    private final UserRepository userRepository;

    @Override
    public CreateBlogResponseDto createBlog(CreateBlogRequestDto requestDto) {

        Optional<User> optionalUser = userRepository.findById(requestDto.getUserId());

        if (!optionalUser.isPresent()) {
            throw new ResourceNotFoundException("User not found");
        }

        User user = optionalUser.get();

        Blog blog = new Blog();

        blog.setTitle(requestDto.getTitle());
        blog.setAuthor(user.getUsername());
        blog.setThumbnail(requestDto.getThumbnail());
        blog.setContent(requestDto.getContent());
        blog.setActiveStatus(ActiveStatus.valueOf(requestDto.getActiveStatus()));
        blog.setCreatedAt(LocalDateTime.now());
        blog.setUpdatedAt(LocalDateTime.now());

        blog.setUser(user);

        Blog savedBlog = blogRepository.save(blog);

        CreateBlogResponseDto responseDto = new CreateBlogResponseDto();

        responseDto.setId(savedBlog.getId());
        responseDto.setTitle(savedBlog.getTitle());
        responseDto.setAuthor(savedBlog.getAuthor());
        responseDto.setThumbnail(savedBlog.getThumbnail());
        responseDto.setContent(savedBlog.getContent());
        responseDto.setActiveStatus(savedBlog.getActiveStatus().toString());
        responseDto.setCreatedAt(savedBlog.getCreatedAt());

        return responseDto;

    }

    @Override
    public UpdateBlogResponseDto updateBlog(Long blogId, UpdateBlogRequestDto requestDto) {

        Optional<Blog> optionalBlog = blogRepository.findById(blogId);

        if (!optionalBlog.isPresent()) {
            throw new ResourceNotFoundException("Blog not found");
        }

        Blog blog = optionalBlog.get();

        blog.setTitle(requestDto.getTitle());
        blog.setThumbnail(requestDto.getThumbnail());
        blog.setContent(requestDto.getContent());
        blog.setActiveStatus(ActiveStatus.valueOf(requestDto.getActiveStatus()));

        Blog updatedBlog = blogRepository.save(blog);

        UpdateBlogResponseDto responseDto = new UpdateBlogResponseDto();

        responseDto.setId(updatedBlog.getId());
        responseDto.setTitle(updatedBlog.getTitle());
        responseDto.setAuthor(updatedBlog.getAuthor());
        responseDto.setThumbnail(updatedBlog.getThumbnail());
        responseDto.setContent(updatedBlog.getContent());
        responseDto.setActiveStatus(updatedBlog.getActiveStatus().toString());
        responseDto.setCreatedAt(updatedBlog.getCreatedAt());
        responseDto.setUpdatedAt(updatedBlog.getUpdatedAt());

        return responseDto;

    }

    @Override
    public void deleteBlog(Long blogId) {

        Optional<Blog> optionalBlog = blogRepository.findById(blogId);

        if (!optionalBlog.isPresent()) {
            throw new ResourceNotFoundException("Blog not found");
        }

        Blog blog = optionalBlog.get();

        blogRepository.deleteById(blog.getId());

    }

    @Override
    public PageResponseDto getAllBlogs(int page, int limit) {

        Pageable pageable = PageRequest.of(page - 1, limit);

        Page<Blog> blogPage = blogRepository.findAll(pageable);

        long totalBlogs = blogPage.getTotalElements();

        List<Blog> blogs = blogPage.getContent();

        if (blogs.isEmpty()) {
            throw new ResourceNotFoundException("No blogs found");
        }

        List<GetAllBlogsResponseDto> responseDtoList = new ArrayList<>();

        for (Blog blog : blogs) {
            GetAllBlogsResponseDto responseDto = new GetAllBlogsResponseDto();

            responseDto.setId(blog.getId());
            responseDto.setTitle(blog.getTitle());
            responseDto.setAuthor(blog.getAuthor());
            responseDto.setThumbnail(blog.getThumbnail());
            responseDto.setContent(blog.getContent());
            responseDto.setActiveStatus(blog.getActiveStatus().toString());
            responseDto.setCreatedAt(blog.getCreatedAt());
            responseDto.setUpdatedAt(blog.getUpdatedAt());

            responseDtoList.add(responseDto);
        }

        int skip = (page - 1) * limit;

        PageResponseDto<GetAllBlogsResponseDto> pageResponseDto = new PageResponseDto<>();
        pageResponseDto.setData(responseDtoList);
        pageResponseDto.setPage(page);
        pageResponseDto.setLimit(limit);
        pageResponseDto.setSkip(skip);
        pageResponseDto.setTotals(totalBlogs);

        return pageResponseDto;
    }

    @Override
    public GetBlogByIdResponseDto getBlogById(Long blogId) {
        Optional<Blog> blogOptional = blogRepository.findById(blogId);

        if (!blogOptional.isPresent()) {
            throw new ResourceNotFoundException("Blog not found");
        }

        Blog blog = blogOptional.get();

        GetBlogByIdResponseDto responseDto = new GetBlogByIdResponseDto();

        responseDto.setId(blog.getId());
        responseDto.setTitle(blog.getTitle());
        responseDto.setAuthor(blog.getAuthor());
        responseDto.setThumbnail(blog.getThumbnail());
        responseDto.setContent(blog.getContent());
        responseDto.setActiveStatus(blog.getActiveStatus().toString());
        responseDto.setCreatedAt(blog.getCreatedAt());
        responseDto.setUpdatedAt(blog.getUpdatedAt());

        return responseDto;

    }

}
