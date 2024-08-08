package com.example.city_tours.entity;

import com.example.city_tours.enums.BookingStatus;
import com.example.city_tours.enums.PaymentStatus;
import com.example.city_tours.enums.ReviewStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "room_bookings")
public class RoomBooking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String startDate;

    private String endDate;

    private Double price;

    private BookingStatus bookingStatus;
    private PaymentStatus paymentStatus;

    private ReviewStatus reviewStatus;

    private String roomType;

    private String roomNumber;

    private String hotelName;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "customer_id")
    private Customer customer;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "room_id")
    private Room room;

}
