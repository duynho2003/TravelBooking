package com.example.city_tours.repository;

import com.example.city_tours.entity.Hotel;
import com.example.city_tours.entity.HotelReview;
import com.example.city_tours.entity.Tour;
import com.example.city_tours.entity.TourReview;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TourReviewRepository extends JpaRepository<TourReview, Long> {
    List<TourReview> findByTour(Tour tour);

    Page<TourReview> findAll(Pageable pageable);

    Page<TourReview> findByTourId(Long tourId, Pageable pageable);
}
