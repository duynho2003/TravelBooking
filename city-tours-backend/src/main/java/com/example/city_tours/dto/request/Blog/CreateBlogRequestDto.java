package com.example.city_tours.dto.request.Blog;

import com.example.city_tours.dto.request.TourLocation.CreateTourLocationRequestDto;
import com.example.city_tours.dto.request.TourTime.CreateTourTimeRequestDto;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Set;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class CreateBlogRequestDto {

    private Long userId;
    private String title;
    private String hashTags;
    private String thumbnail;
    private String description;
    private String content;
    private String activeStatus;

}