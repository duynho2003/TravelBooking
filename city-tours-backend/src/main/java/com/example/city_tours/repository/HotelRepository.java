package com.example.city_tours.repository;

import com.example.city_tours.entity.Hotel;
import com.example.city_tours.entity.Tour;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HotelRepository extends JpaRepository<Hotel, Long> {
}
