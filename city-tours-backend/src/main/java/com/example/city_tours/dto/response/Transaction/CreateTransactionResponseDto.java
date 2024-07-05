package com.example.city_tours.dto.response.Transaction;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class CreateTransactionResponseDto {

    private Long id;
    private String code;
    private String type;
    private String bankCode;
    private String bankTranNo;
    private String cardType;
    private int amount;
    private String content;
    private String payDate;
    private String paymentStatus;
    private String transactionStatus;
    
}
