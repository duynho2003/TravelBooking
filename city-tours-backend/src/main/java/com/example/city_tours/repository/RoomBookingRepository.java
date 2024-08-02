package com.example.city_tours.repository;

import com.example.city_tours.entity.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface RoomBookingRepository extends JpaRepository<RoomBooking, Long> {
    List<RoomBooking> findByRoom(Room room);

    List<RoomBooking> findByCustomerId(Long customerId);

    Page<RoomBooking> findAllByCustomerId(Long customerId, Pageable pageable);

    List<RoomBooking> findByCreatedAtBetween(LocalDateTime startDateTime, LocalDateTime endDateTime);

    Page<RoomBooking> findAll(Specification<Room> spec, Pageable pageable);
}
