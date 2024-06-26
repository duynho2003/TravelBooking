package com.example.city_tours.entity;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RoomImageRepository extends JpaRepository<RoomImage, Long> {
    List<RoomImage> findByRoomId(Long roomId);

    void deleteAllByRoomId(Long roomId);
}