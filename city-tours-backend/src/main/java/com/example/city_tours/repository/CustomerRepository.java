package com.example.city_tours.repository;

import com.example.city_tours.entity.Customer;
import com.example.city_tours.entity.RoomBooking;
import com.example.city_tours.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface CustomerRepository extends JpaRepository<Customer, Long> {
//    User findByUsername(String username);
//
//    boolean existsByUsername(String username);
//
//    boolean existsByEmail(String email);
//
//    @Query(value = "SELECT u FROM User u ORDER BY u.id")
//    List<User> findAllWithPagination(int limit, int offset);
//
//    Page<User> findAll(Specification<User> spec, Pageable pageable);

    Customer findByUserId(Long userId);
}
