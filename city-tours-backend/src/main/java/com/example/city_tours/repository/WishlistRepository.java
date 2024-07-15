package com.example.city_tours.repository;

import com.example.city_tours.entity.Customer;
import com.example.city_tours.entity.Tour;
import com.example.city_tours.entity.Wishlist;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WishlistRepository extends JpaRepository<Wishlist, Long> {
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

    Page<Wishlist> findAllByUserId(Long userId, Pageable pageable);

    Wishlist findByName(String name);
}
