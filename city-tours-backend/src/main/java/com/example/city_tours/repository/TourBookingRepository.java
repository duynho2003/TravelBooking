package com.example.city_tours.repository;

import com.example.city_tours.entity.Room;
import com.example.city_tours.entity.Tour;
import com.example.city_tours.entity.TourBooking;
import com.example.city_tours.entity.TourRoomBooking;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TourBookingRepository extends JpaRepository<TourBooking, Long> {
    Page<TourBooking> findAll(Pageable pageable);
}
