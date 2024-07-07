package com.example.city_tours.service;

import com.example.city_tours.dto.request.User.CreateAccountRequestDto;
import com.example.city_tours.dto.request.User.UpdateAccountRequestDto;
import com.example.city_tours.dto.response.Customer.CreateCustomerResponseDto;
import com.example.city_tours.dto.response.RoomBooking.GetRoomBookingResponseDto;
import com.example.city_tours.dto.response.User.*;
import com.example.city_tours.entity.Customer;
import com.example.city_tours.entity.Role;
import com.example.city_tours.entity.RoomBooking;
import com.example.city_tours.entity.User;
import com.example.city_tours.enums.UserStatus;
import com.example.city_tours.exception.EmailAlreadyExistsException;
import com.example.city_tours.exception.ResourceNotFoundException;
import com.example.city_tours.exception.UsernameAlreadyExistsException;
import com.example.city_tours.repository.RoleRepository;
import com.example.city_tours.repository.RoomBookingRepository;
import com.example.city_tours.repository.UserRepository;
import jakarta.persistence.criteria.Predicate;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
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
    private final RoomBookingRepository roomBookingRepository;

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

        if (user.getCustomer() != null) {
            CreateCustomerResponseDto createCustomerResponseDto = new CreateCustomerResponseDto();

            createCustomerResponseDto.setId(user.getCustomer().getId());
            createCustomerResponseDto.setUserId(user.getId());
            createCustomerResponseDto.setName(user.getCustomer().getName());
            createCustomerResponseDto.setPhone(user.getCustomer().getPhone());
            createCustomerResponseDto.setAddress(user.getCustomer().getAddress());

            responseDto.setCustomer(createCustomerResponseDto);

            Customer customer = user.getCustomer();

            List<RoomBooking> roomBookings = roomBookingRepository.findByCustomerId(customer.getId());

            Set<GetRoomBookingResponseDto> roomBookingsDto = new HashSet<>();

            for (RoomBooking roomBooking : roomBookings) {
                GetRoomBookingResponseDto bookingResponseDto = new GetRoomBookingResponseDto();

                bookingResponseDto.setId(roomBooking.getId());
                bookingResponseDto.setDate(roomBooking.getDate());
                bookingResponseDto.setStartHour(roomBooking.getStartHour());
                bookingResponseDto.setEndHour(roomBooking.getEndHour());
                bookingResponseDto.setPrice(roomBooking.getPrice());
                bookingResponseDto.setReviewStatus(roomBooking.getReviewStatus().toString());
                bookingResponseDto.setRoomType(roomBooking.getRoomType());
                bookingResponseDto.setCustomerId(roomBooking.getCustomer().getId());
                bookingResponseDto.setRoomId(roomBooking.getRoom().getId());
                bookingResponseDto.setCreatedAt(roomBooking.getCreatedAt());
                bookingResponseDto.setUpdatedAt(roomBooking.getUpdatedAt());

                roomBookingsDto.add(bookingResponseDto);
            }

            responseDto.setRoomBookings(roomBookingsDto);
        }

        return responseDto;
    }

    @Override
    public List<GetAllAccountsResponseDto> getAllAccounts(int page, int limit, String search, String role, String status) {
        // Calculate the offset based on page and limit
        int offset = (page - 1) * limit;

        // Fetch users from the repository with pagination
        Pageable pageable = PageRequest.of(page - 1, limit);

        // Create Specification for dynamic query based on search, role, and status parameters
        Specification<User> spec = (root, query, cb) -> {
            Predicate predicate = cb.conjunction(); // Start with an "AND" conjunction

            // Add condition to search for username or email if search parameter is provided
            if (search != null && !search.isEmpty()) {
                Predicate usernamePredicate = cb.like(cb.lower(root.get("username")), "%" + search.toLowerCase() + "%");
                Predicate emailPredicate = cb.like(cb.lower(root.get("email")), "%" + search.toLowerCase() + "%");
                predicate = cb.or(usernamePredicate, emailPredicate);
            }

            // Add condition to filter by role if role parameter is provided
            if (role != null && !role.isEmpty()) {
                predicate = cb.and(predicate, cb.equal(root.join("roles").get("name"), role));
            }

            // Add condition to filter by status if status parameter is provided
            if (status != null && !status.isEmpty()) {
                predicate = cb.and(predicate, cb.equal(root.get("status"), UserStatus.valueOf(status.toUpperCase())));
            }

            return predicate;
        };

        // Fetch users from the repository with pagination and dynamic query
        Page<User> userPage = userRepository.findAll(spec, pageable);

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
