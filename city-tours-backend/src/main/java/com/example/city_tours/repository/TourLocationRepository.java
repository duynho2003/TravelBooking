package com.example.city_tours.repository;

import com.example.city_tours.entity.TourLocation;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TourLocationRepository extends JpaRepository<TourLocation, Long> {
}