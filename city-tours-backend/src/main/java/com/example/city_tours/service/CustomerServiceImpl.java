package com.example.city_tours.service;

import com.example.city_tours.dto.request.Customer.CreateCustomerRequestDto;
import com.example.city_tours.dto.request.Customer.UpdateCustomerRequestDto;
import com.example.city_tours.dto.request.User.CreateAccountRequestDto;
import com.example.city_tours.dto.request.User.UpdateAccountRequestDto;
import com.example.city_tours.dto.response.Customer.CreateCustomerResponseDto;
import com.example.city_tours.dto.response.Customer.UpdateCustomerResponseDto;
import com.example.city_tours.dto.response.User.CreateAccountResponseDto;
import com.example.city_tours.dto.response.User.GetAccountByIdResponseDto;
import com.example.city_tours.dto.response.User.GetAllAccountsResponseDto;
import com.example.city_tours.dto.response.User.UpdateAccountResponseDto;
import com.example.city_tours.entity.Customer;
import com.example.city_tours.entity.Role;
import com.example.city_tours.entity.User;
import com.example.city_tours.enums.UserStatus;
import com.example.city_tours.exception.EmailAlreadyExistsException;
import com.example.city_tours.exception.ResourceNotFoundException;
import com.example.city_tours.exception.UsernameAlreadyExistsException;
import com.example.city_tours.repository.CustomerRepository;
import com.example.city_tours.repository.RoleRepository;
import com.example.city_tours.repository.UserRepository;
import jakarta.persistence.criteria.Predicate;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class CustomerServiceImpl implements CustomerService{

    private final UserRepository userRepository;
    private final CustomerRepository customerRepository;

    @Override
    public CreateCustomerResponseDto createCustomer(CreateCustomerRequestDto requestDto) {

        Optional<User> optionalUser = userRepository.findById(requestDto.getUserId());

        if (!optionalUser.isPresent()) {
            throw new ResourceNotFoundException("User not found");
        }

        User user = optionalUser.get();

        Customer customer = new Customer();

        customer.setName(requestDto.getName());
        customer.setPhone(requestDto.getPhone());
        customer.setAddress(requestDto.getAddress());
        customer.setUser(user);

        Customer savedCustomer = customerRepository.save(customer);

        CreateCustomerResponseDto responseDto = new CreateCustomerResponseDto();

        responseDto.setId(savedCustomer.getId());
        responseDto.setName(savedCustomer.getName());
        responseDto.setPhone(savedCustomer.getPhone());
        responseDto.setAddress(savedCustomer.getAddress());
        responseDto.setUserId(savedCustomer.getUser().getId());

        return responseDto;
    }

    @Override
    public UpdateCustomerResponseDto updateCustomer(Long userId, UpdateCustomerRequestDto requestDto) {

        Optional<User> optionalUser = userRepository.findById(userId);

        if (!optionalUser.isPresent()) {
            throw new ResourceNotFoundException("User not found");
        }

        User user = optionalUser.get();

        Customer customer = user.getCustomer();

        if (customer == null) {
            customer = new Customer();
            customer.setUser(user);
            user.setCustomer(customer);
        }

        customer.setName(requestDto.getName());
        customer.setPhone(requestDto.getPhone());
        customer.setAddress(requestDto.getAddress());
        customer.setUser(user);

        Customer savedCustomer = customerRepository.save(customer);

        UpdateCustomerResponseDto responseDto = new UpdateCustomerResponseDto();

        responseDto.setId(savedCustomer.getId());
        responseDto.setName(savedCustomer.getName());
        responseDto.setPhone(savedCustomer.getPhone());
        responseDto.setAddress(savedCustomer.getAddress());
        responseDto.setUserId(savedCustomer.getUser().getId());

        return responseDto;
    }

}
