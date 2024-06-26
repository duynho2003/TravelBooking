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
@Table(name = "hotels")
public class Hotel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(columnDefinition = "LONGTEXT")
    private String description;

    private String address;

    private Double rating;

    private int numberOfRating;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "hotel_id")
    private Set<HotelImage> images;

    private ActiveStatus activeStatus;

    @ManyToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JoinTable(name = "hotels_rooms",
            joinColumns = @JoinColumn(name = "hotel_id", referencedColumnName = "id"),
            inverseJoinColumns = @JoinColumn(name = "room_id", referencedColumnName = "id"))

    private Set<Room> rooms;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

}
