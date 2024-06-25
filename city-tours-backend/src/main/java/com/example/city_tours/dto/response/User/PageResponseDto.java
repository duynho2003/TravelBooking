package com.example.city_tours.dto.response.User;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class PageResponseDto<T> {
    private int page;
    private int limit;
    private int skip;
    private long totals;
    private List<T> data;
}
