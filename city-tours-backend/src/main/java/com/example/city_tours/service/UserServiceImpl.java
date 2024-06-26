package com.example.city_tours.service;

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
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
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
    public void deleteAccount(Long userId) {

        Optional<User> userOptional = userRepository.findById(userId);

        if (!userOptional.isPresent()) {
            throw new ResourceNotFoundException("Account not found");
        }

        User user = userOptional.get();

        user.setRoles(new HashSet<>());

        userRepository.save(user);

        userRepository.deleteById(userId);

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
        responseDto.setPassword(user.getPassword());
        responseDto.setEmail(user.getEmail());
        responseDto.setRoles(user.getRoles().stream().map(Role::getName).collect(Collectors.toSet()));
        responseDto.setStatus(user.getStatus().toString());
        responseDto.setCreateAt(user.getCreatedAt());
        responseDto.setUpdatedAt(user.getUpdatedAt());

        return responseDto;
    }

    @Override
    public List<GetAllAccountsResponseDto> getAllAccounts(int page, int limit) {
        // Calculate the offset based on page and limit
        int offset = (page - 1) * limit;

        // Fetch users from the repository with pagination
        Pageable pageable = PageRequest.of(page - 1, limit);
        Page<User> userPage = userRepository.findAll(pageable);

        // Retrieve the content from the fetched page
        List<User> users = userPage.getContent();

        // Check if the fetched list of users is empty
        if (users.isEmpty()) {
            throw new ResourceNotFoundException("No users found");
        }

        // Convert users to GetAllAccountsResponseDto
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

        // Return the responseDtoList
        return responseDtoList;
    }
}
