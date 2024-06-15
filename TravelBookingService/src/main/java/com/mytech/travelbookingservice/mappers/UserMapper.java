package com.mytech.travelbookingservice.mappers;

import com.mytech.travelbookingservice.dtos.UserDTO;
import com.mytech.travelbookingservice.entities.User;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;
import org.mapstruct.factory.Mappers;

@Mapper(unmappedTargetPolicy = ReportingPolicy.IGNORE, componentModel = "spring")
public interface UserMapper {
    UserMapper MAPPER = Mappers.getMapper( UserMapper.class );

    UserDTO userToUserDTO(User user);

    //@Mapping(target = "roles", ignore = true)
    User userDTOToUser(UserDTO userDTO);

}
