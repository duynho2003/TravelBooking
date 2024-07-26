package com.example.city_tours.dto.request.Blog;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class UpdateBlogRequestDto {

    private String title;
    private String thumbnail;
    private String description;
    private String content;
    private String activeStatus;

}