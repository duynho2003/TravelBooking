//package com.example.city_tours.entity;
//
//import jakarta.persistence.*;
//import lombok.AllArgsConstructor;
//import lombok.Getter;
//import lombok.NoArgsConstructor;
//import lombok.Setter;
//import java.time.LocalDateTime;
//
//@NoArgsConstructor
//@AllArgsConstructor
//@Getter
//@Setter
//@Entity
//@Table(name = "schedule_day_times")
//public class ScheduleDayTime {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long id;
//
//    @ManyToOne(fetch = FetchType.LAZY)
//    @JoinColumn(name = "schedule_day_id", referencedColumnName = "id")
//    private ScheduleDay scheduleDay;
//
//    private String startTime;
//
//    private String endTime;
//
//    @Column(columnDefinition = "TEXT")
//    private String activities;
//
//}
