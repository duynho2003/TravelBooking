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
@Table(name = "schedules")
public class Schedule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String dayOfWeek;

    private String date;

//    private String endDay;
//
//    @OneToMany(mappedBy = "schedule", cascade = CascadeType.ALL)
//    private Set<ScheduleDay> scheduleDays;

}
