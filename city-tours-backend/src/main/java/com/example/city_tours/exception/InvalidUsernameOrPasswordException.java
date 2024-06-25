package com.example.city_tours.exception;

public class InvalidUsernameOrPasswordException extends RuntimeException{

    public InvalidUsernameOrPasswordException(String message) {
        super(message);
    }

}
