package com.example.city_tours.config;

import com.cloudinary.Cloudinary;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.HashMap;
import java.util.Map;

@Configuration
public class CloudinaryConfig {

    @Bean
    public Cloudinary getCloudinary(){
        Map config = new HashMap();
        config.put("cloud_name", "dbammk7wt");
        config.put("api_key", "435768888694151");
        config.put("api_secret", "m3aMSkG1Glln9vZrwDfLKbUsJvA");
        config.put("secure", true);
        return new Cloudinary(config);
    }


}
