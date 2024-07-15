package com.example.city_tours.repository;

import com.example.city_tours.entity.Room;
import com.example.city_tours.entity.RoomBooking;
import com.example.city_tours.entity.TourRoomBooking;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RoomBookingRepository extends JpaRepository<RoomBooking, Long> {
    List<RoomBooking> findByRoom(Room room);

    List<RoomBooking> findByCustomerId(Long customerId);

    Page<RoomBooking> findAllByCustomerId(Long customerId, Pageable pageable);

    RoomBooking findByRoomId(Long roomId);
}
