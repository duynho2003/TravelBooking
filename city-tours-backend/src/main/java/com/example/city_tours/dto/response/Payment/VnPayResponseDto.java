package com.example.city_tours.dto.response.Payment;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class VnPayResponseDto {

    private String amount;
    private String bankCode;
    private String orderInfo;
    private String payDate;
    private String responseCode;
    private String transactionNo;
    private String transactionStatus;

}
