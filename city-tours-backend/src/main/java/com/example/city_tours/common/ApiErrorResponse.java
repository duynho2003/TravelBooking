package com.example.city_tours.common;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class ApiErrorResponse {
    private int status;
    private String message;
    private int code;
    private String moreInfo;

    @Override
    public String toString() {
        return "{" +
                "\"status\": " + status +
                ", \"message\": \"" + message + "\"" +
                ", \"code\": \"" + code + "\"" +
                ", \"moreInfo\": \"" + moreInfo + "\"" +
                "}";
    }
}




