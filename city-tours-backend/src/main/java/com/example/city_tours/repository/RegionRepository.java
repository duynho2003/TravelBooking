package com.example.city_tours.repository;

import com.example.city_tours.entity.Region;
import com.example.city_tours.entity.Transaction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RegionRepository extends JpaRepository<Region, Long> {
//    Page<Region> findAll(Specification<Region> spec, Pageable pageable);
}
