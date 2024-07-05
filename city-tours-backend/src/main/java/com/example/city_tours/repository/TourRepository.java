package com.example.city_tours.repository;

import com.example.city_tours.entity.Tour;
import com.example.city_tours.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface TourRepository extends JpaRepository<Tour, Long> {
    Page<Tour> findAll(Specification<Tour> spec, Pageable pageable);
}
