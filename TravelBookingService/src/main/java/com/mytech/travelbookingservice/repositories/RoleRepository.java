package com.mytech.travelbookingservice.repositories;

import com.mytech.travelbookingservice.entities.Role;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoleRepository extends CrudRepository<Role, Long> {

}
