package com.example.city_tours.dto.response.Blog;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class UpdateBlogResponseDto {

    private Long id;
    private String title;
    private String author;
    private String thumbnail;
    private String content;
    private String activeStatus;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

}