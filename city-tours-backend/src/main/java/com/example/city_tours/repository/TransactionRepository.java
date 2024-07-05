package com.example.city_tours.repository;

import com.example.city_tours.entity.Transaction;
import com.example.city_tours.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    Page<Transaction> findAll(Specification<Transaction> spec, Pageable pageable);
}
