package com.example.city_tours.entity;

import com.example.city_tours.enums.PaymentStatus;
import com.example.city_tours.enums.TransactionStatus;
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
@Table(name = "transactions")
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String code;

    private String type;

    private String bankCode;

    private String bankTranNo;

    private String cardType;

    private int amount;

    private String content;

    private String payDate;

    private PaymentStatus paymentStatus;

    private TransactionStatus transactionStatus;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

}
