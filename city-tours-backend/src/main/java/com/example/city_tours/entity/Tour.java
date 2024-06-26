package com.example.city_tours.entity;

import com.example.city_tours.enums.ActiveStatus;
import com.example.city_tours.enums.BookedStatus;
import com.example.city_tours.enums.UserStatus;
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
@Table(name = "tours")
public class Tour {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(columnDefinition = "LONGTEXT")
    private String description;

    private String address;

    private Double rating;

    private int numberOfRating;

    private Double price;

    private String thumbnail;

    private BookedStatus bookedStatus;

    private ActiveStatus activeStatus;

    @ManyToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JoinTable(name = "tours_schedules",
            joinColumns = @JoinColumn(name = "tour_id", referencedColumnName = "id"),
            inverseJoinColumns = @JoinColumn(name = "schedule_id", referencedColumnName = "id"))

    private Set<Schedule> schedules;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

}
