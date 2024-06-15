package com.mytech.travelbookingservice.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.NoRepositoryBean;

@NoRepositoryBean
public interface SearchRepository<T, ID>  extends JpaRepository<T, ID> {
    public Page<T> findAll(String searchText, Pageable pageable);
}
