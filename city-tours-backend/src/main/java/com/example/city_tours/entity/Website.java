package com.example.city_tours.entity;

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
@Table(name = "website")
public class Website {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String logo;

    private String email;

    private String phone;

    private String address;

    private String workingDate;

    private String workingTime;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

}
