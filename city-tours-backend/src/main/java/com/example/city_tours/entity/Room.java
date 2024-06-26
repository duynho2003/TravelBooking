package com.example.city_tours.entity;

import com.example.city_tours.enums.ActiveStatus;
import com.example.city_tours.enums.BookedStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.Set;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "rooms")
public class Room {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String roomNumber;

    private String type;

    private Double price;

    private BookedStatus bookedStatus;

    private ActiveStatus activeStatus;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "room_id")
    private Set<RoomImage> images;

    @ManyToMany(mappedBy = "rooms")
    private Set<Hotel> hotels;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

}
