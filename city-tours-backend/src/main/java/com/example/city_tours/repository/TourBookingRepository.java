package com.example.city_tours.repository;

import com.example.city_tours.entity.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public interface TourBookingRepository extends JpaRepository<TourBooking, Long> {
    Page<TourBooking> findAll(Specification<Tour> spec, Pageable pageable);
    List<TourBooking> findByCustomerId(Long customerId);
    Page<TourBooking> findAllByCustomerId(Long customerId, Pageable pageable);
    boolean existsByTourId(Long tourId);
    List<TourBooking> findByCreatedAtBetween(LocalDateTime start, LocalDateTime end);

}
