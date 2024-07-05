package com.example.city_tours.repository;

import com.example.city_tours.entity.Province;
import com.example.city_tours.entity.Region;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProvinceRepository extends JpaRepository<Province, Long> {
//    Page<Region> findAll(Specification<Region> spec, Pageable pageable);
}
