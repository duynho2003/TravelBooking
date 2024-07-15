package com.example.city_tours.dto.request.Customer;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class UpdateCustomerRequestDto {

    private String name;
    private String phone;
    private String address;

}
