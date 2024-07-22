package com.example.city_tours.repository;

import com.example.city_tours.entity.Blog;
import com.example.city_tours.entity.Tour;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BlogRepository extends JpaRepository<Blog, Long> {
    Page<Blog> findAll(Specification<Blog> spec, Pageable pageable);
}
