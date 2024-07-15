package com.example.city_tours.repository;

import com.example.city_tours.entity.RoomHoliday;
import com.example.city_tours.entity.RoomImage;
import com.example.city_tours.entity.Wishlist;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RoomHolidayRepository extends JpaRepository<RoomHoliday, Long> {
    List<RoomHoliday> findByRoomId(Long roomId);

}
