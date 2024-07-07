package com.example.city_tours.repository;

import com.example.city_tours.entity.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface HotelReviewRepository extends JpaRepository<HotelReview, Long> {
    List<HotelReview> findByHotel(Hotel hotel);

    Page<HotelReview> findAll(Pageable pageable);

    Page<HotelReview> findByHotelId(Long hotelId, Pageable pageable);
}
