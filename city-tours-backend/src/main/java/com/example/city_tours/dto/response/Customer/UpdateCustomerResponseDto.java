package com.example.city_tours.dto.response.Customer;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class UpdateCustomerResponseDto {

    private Long id;
    private Long userId;
    private String name;
    private String phone;
    private String address;

}
