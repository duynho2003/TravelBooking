package com.example.city_tours.repository;

import com.example.city_tours.entity.Room;
import com.example.city_tours.entity.Tour;
import com.example.city_tours.entity.TourRoomBooking;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TourRoomBookingRepository extends JpaRepository<TourRoomBooking, Long> {
    List<TourRoomBooking> findByRoom(Room room);
}
