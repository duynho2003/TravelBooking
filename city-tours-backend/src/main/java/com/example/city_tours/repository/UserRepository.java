package com.example.city_tours.repository;

import com.example.city_tours.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface UserRepository extends JpaRepository<User, Long> {
    User findByUsername(String username);

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);

    @Query(value = "SELECT u FROM User u ORDER BY u.id")
    List<User> findAllWithPagination(int limit, int offset);
}
