//package com.example.city_tours.entity;
//
//import jakarta.persistence.*;
//import lombok.AllArgsConstructor;
//import lombok.Getter;
//import lombok.NoArgsConstructor;
//import lombok.Setter;
//import java.util.List;
//
//@NoArgsConstructor
//@AllArgsConstructor
//@Getter
//@Setter
//@Entity
//@Table(name = "schedule_days")
//public class ScheduleDay {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long id;
//
//    @ManyToOne(fetch = FetchType.LAZY)
//    @JoinColumn(name = "schedule_id", referencedColumnName = "id")
//    private Schedule schedule;
//
//    private String dayOfWeek;
//
//    @OneToMany(mappedBy = "scheduleDay", cascade = CascadeType.ALL)
//    private List<ScheduleDayTime> dayTimes;
//
//}
