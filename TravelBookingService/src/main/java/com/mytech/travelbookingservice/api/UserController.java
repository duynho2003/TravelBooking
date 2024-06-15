package com.mytech.travelbookingservice.api;

import com.mytech.travelbookingservice.entities.User;
import com.mytech.travelbookingservice.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api")
public class UserController {
    @Autowired
    UserRepository userRepository;

    @GetMapping("/users")
    public ResponseEntity<?> getUsers() {
        List<User> users = userRepository.findAll();
        return ResponseEntity.ok(users);
    }

//    @PostMapping("/user")
//    public void addUser(@RequestBody User user) {
//        users.add(user);
//        return;
//    }
}
