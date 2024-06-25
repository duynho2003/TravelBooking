package com.example.city_tours.exception;

public class ServerErrorException extends RuntimeException{

    public ServerErrorException(String message) {
        super(message);
    }

}
