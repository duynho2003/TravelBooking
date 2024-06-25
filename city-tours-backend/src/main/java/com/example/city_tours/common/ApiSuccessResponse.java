package com.example.city_tours.common;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class ApiSuccessResponse<T> {
    private int status;
    private String message;
    private T data;

    @Override
    public String toString() {
        return "ApiSuccessResponse{" +
                "status=" + status +
                ", message='" + message + '\'' +
                ", data=" + data +
                '}';
    }
}
