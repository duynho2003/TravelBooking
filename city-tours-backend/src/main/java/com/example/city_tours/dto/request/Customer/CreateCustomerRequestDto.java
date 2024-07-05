package com.example.city_tours.dto.request.Customer;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Set;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class CreateCustomerRequestDto {

    private Long userId;
    private String name;
    private String phone;
    private String address;

}
