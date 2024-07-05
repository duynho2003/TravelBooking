package com.example.city_tours.repository;

import com.example.city_tours.entity.Hotel;
import com.example.city_tours.entity.Province;
import com.example.city_tours.entity.Tour;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HotelRepository extends JpaRepository<Hotel, Long> {
    Page<Hotel> findAll(Specification<Hotel> spec, Pageable pageable);
}
