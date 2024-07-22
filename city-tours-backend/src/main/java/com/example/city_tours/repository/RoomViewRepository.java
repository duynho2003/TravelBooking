package com.example.city_tours.repository;

import com.example.city_tours.entity.RoomHoliday;
import com.example.city_tours.entity.RoomView;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RoomViewRepository extends JpaRepository<RoomView, Long> {
    List<RoomView> findByRoomId(Long roomId);

}
