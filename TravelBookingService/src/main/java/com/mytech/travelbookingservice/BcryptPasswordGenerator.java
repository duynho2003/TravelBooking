package com.mytech.travelbookingservice;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class BcryptPasswordGenerator {

    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String encodedPassword = encoder.encode("tommy0211");
        System.out.println("Encoded password: " + encodedPassword);
    }
}
