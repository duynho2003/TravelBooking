package com.example.city_tours.service;

import com.example.city_tours.dto.request.User.ChangeStatusAccountRequestDto;
import com.example.city_tours.dto.request.User.CreateAccountRequestDto;
import com.example.city_tours.dto.request.User.UpdateAccountRequestDto;
import com.example.city_tours.dto.response.User.*;
import com.example.city_tours.entity.Role;
import com.example.city_tours.entity.User;
import com.example.city_tours.enums.UserStatus;
import com.example.city_tours.exception.EmailAlreadyExistsException;
import com.example.city_tours.exception.ResourceNotFoundException;
import com.example.city_tours.exception.UsernameAlreadyExistsException;
import com.example.city_tours.repository.RoleRepository;
import com.example.city_tours.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class UserServiceImpl implements UserService{

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    private final RoleRepository roleRepository;

    @Override
    public CreateAccountResponseDto createAccount(CreateAccountRequestDto createAccountRequestDto) {

        if (userRepository.existsByUsername(createAccountRequestDto.getUsername())) {
            throw new UsernameAlreadyExistsException("Username is already taken");
        }

        if (userRepository.existsByEmail(createAccountRequestDto.getEmail())) {
            throw new EmailAlreadyExistsException("Email is already registered");
        }

        User user = new User();

        user.setUsername(createAccountRequestDto.getUsername());
        user.setEmail(createAccountRequestDto.getEmail());
        user.setPassword(passwordEncoder.encode(createAccountRequestDto.getPassword()));
        user.setStatus(UserStatus.ACTIVE);
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());

        Set<Role> roles = new HashSet<>();

        for (String roleName : createAccountRequestDto.getRoles()) {
            Role role = roleRepository.findByName(roleName);

            if (role == null) {
                role = new Role();
                role.setName(roleName);
                roleRepository.save(role);
            }

            roles.add(role);
        }

        user.setRoles(roles);

        userRepository.save(user);

        CreateAccountResponseDto responseDto = new CreateAccountResponseDto();

        responseDto.setId(user.getId());
        responseDto.setUsername(user.getUsername());
        responseDto.setEmail(user.getEmail());
        responseDto.setRoles(user.getRoles().stream().map(Role::getName).collect(Collectors.toSet()));
        responseDto.setCreateAt(user.getCreatedAt());

        return responseDto;
    }

    @Override
    public UpdateAccountResponseDto updateAccount(Long userId, UpdateAccountRequestDto updateAccountRequestDto) {

        Optional<User> userOptional = userRepository.findById(userId);

        if (!userOptional.isPresent()) {
            throw new ResourceNotFoundException("User not found");
        }

        User user = userOptional.get();

        user.setUsername(updateAccountRequestDto.getUsername());
        user.setEmail(updateAccountRequestDto.getEmail());
        user.setPassword(passwordEncoder.encode(updateAccountRequestDto.getPassword()));

        if (updateAccountRequestDto.getStatus() != null) {
            user.setStatus(UserStatus.valueOf(updateAccountRequestDto.getStatus().toUpperCase()));
        } else {
            throw new IllegalArgumentException("No enum");
        }

        user.setUpdatedAt(LocalDateTime.now());

        Set<Role> roles = new HashSet<>();

        for (String roleName : updateAccountRequestDto.getRoles()) {
            Role role = roleRepository.findByName(roleName);

            if (role == null) {
                role = new Role();
                role.setName(roleName);
                roleRepository.save(role);
            }

            roles.add(role);
        }

        user.setRoles(roles);

        userRepository.save(user);

        UpdateAccountResponseDto responseDto = new UpdateAccountResponseDto();

        responseDto.setId(user.getId());
        responseDto.setUsername(user.getUsername());
        responseDto.setEmail(user.getEmail());
        responseDto.setRoles(user.getRoles().stream().map(Role::getName).collect(Collectors.toSet()));
        responseDto.setStatus(user.getStatus().toString());
        responseDto.setUpdatedAt(user.getUpdatedAt());

        return responseDto;
    }

    @Override
    public ChangeStatusAccountResponseDto changeStatusAccount(Long userId, ChangeStatusAccountRequestDto changeStatusAccountRequestDto) {

        Optional<User> userOptional = userRepository.findById(userId);

        if (!userOptional.isPresent()) {
            throw new ResourceNotFoundException("User not found");
        }

        User user = userOptional.get();

        if (changeStatusAccountRequestDto.getStatus() != null) {
            user.setStatus(UserStatus.valueOf(changeStatusAccountRequestDto.getStatus().toUpperCase()));
        } else {
            throw new IllegalArgumentException("No enum ");
        }

        userRepository.save(user);

        ChangeStatusAccountResponseDto responseDto = new ChangeStatusAccountResponseDto();

        responseDto.setId(user.getId());
        responseDto.setUsername(user.getUsername());
        responseDto.setEmail(user.getEmail());
        responseDto.setRoles(user.getRoles().stream().map(Role::getName).collect(Collectors.toSet()));
        responseDto.setStatus(user.getStatus().toString());
        responseDto.setUpdatedAt(user.getUpdatedAt());

        return responseDto;
    }

    @Override
    public GetAccountByIdResponseDto getAccountById(Long userId) {

        Optional<User> userOptional = userRepository.findById(userId);

        if (!userOptional.isPresent()) {
            throw new ResourceNotFoundException("User not found");
        }

        User user = userOptional.get();

        GetAccountByIdResponseDto responseDto = new GetAccountByIdResponseDto();

        responseDto.setId(user.getId());
        responseDto.setUsername(user.getUsername());
        responseDto.setEmail(user.getEmail());
        responseDto.setRoles(user.getRoles().stream().map(Role::getName).collect(Collectors.toSet()));
        responseDto.setStatus(user.getStatus().toString());
        responseDto.setCreateAt(user.getCreatedAt());
        responseDto.setUpdatedAt(user.getUpdatedAt());

        return responseDto;
    }

    @Override
    public Page<GetAllAccountsResponseDto> getAllAccounts(int page, int limit, int skip) {
        // Calculate the offset based on page, limit, and skip
        int offset = (page - 1) * limit + skip;

        // Retrieve a page of users from the repository with offset
        Page<User> userPage = userRepository.findAll(PageRequest.of(page - 1, limit));

        // Check if the page has any users
        if (userPage.isEmpty()) {
            throw new ResourceNotFoundException("No users found");
        }

        // Skip the specified number of records in the page
        List<User> users = userPage.getContent();
        int toSkip = Math.min(offset, users.size());
        users = users.subList(toSkip, users.size());

        // Convert remaining users to GetAllAccountsResponseDto
        List<GetAllAccountsResponseDto> responseDtoList = users.stream()
                .map(user -> {
                    GetAllAccountsResponseDto responseDto = new GetAllAccountsResponseDto();
                    responseDto.setId(user.getId());
                    responseDto.setUsername(user.getUsername());
                    responseDto.setEmail(user.getEmail());
                    responseDto.setRoles(user.getRoles().stream().map(Role::getName).collect(Collectors.toSet()));
                    responseDto.setStatus(user.getStatus().toString());
                    responseDto.setCreateAt(user.getCreatedAt());
                    responseDto.setUpdatedAt(user.getUpdatedAt());
                    return responseDto;
                })
                .collect(Collectors.toList());

        return new PageImpl<>(responseDtoList, PageRequest.of(page - 1, limit), userPage.getTotalElements());
    }
    
}
