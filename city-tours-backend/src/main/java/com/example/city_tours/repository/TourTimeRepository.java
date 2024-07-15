package com.example.city_tours.repository;

import com.example.city_tours.entity.TourTime;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TourTimeRepository extends JpaRepository<TourTime, Long> {
}