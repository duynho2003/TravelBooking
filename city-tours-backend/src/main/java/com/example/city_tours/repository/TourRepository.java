package com.example.city_tours.repository;

import com.example.city_tours.entity.Tour;
import com.example.city_tours.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface TourRepository extends JpaRepository<Tour, Long> {
    boolean existsByName(String name);
}
