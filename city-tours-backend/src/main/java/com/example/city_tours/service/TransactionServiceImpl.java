package com.example.city_tours.service;

import com.example.city_tours.dto.request.Transaction.CreateTransactionRequestDto;
import com.example.city_tours.dto.request.User.CreateAccountRequestDto;
import com.example.city_tours.dto.request.User.UpdateAccountRequestDto;
import com.example.city_tours.dto.response.Transaction.CreateTransactionResponseDto;
import com.example.city_tours.dto.response.Transaction.GetAllTransactionsResponseDto;
import com.example.city_tours.dto.response.User.CreateAccountResponseDto;
import com.example.city_tours.dto.response.User.GetAccountByIdResponseDto;
import com.example.city_tours.dto.response.User.GetAllAccountsResponseDto;
import com.example.city_tours.dto.response.User.UpdateAccountResponseDto;
import com.example.city_tours.entity.Role;
import com.example.city_tours.entity.Transaction;
import com.example.city_tours.entity.User;
import com.example.city_tours.enums.PaymentStatus;
import com.example.city_tours.enums.TransactionStatus;
import com.example.city_tours.enums.UserStatus;
import com.example.city_tours.exception.EmailAlreadyExistsException;
import com.example.city_tours.exception.ResourceNotFoundException;
import com.example.city_tours.exception.UsernameAlreadyExistsException;
import com.example.city_tours.repository.RoleRepository;
import com.example.city_tours.repository.TransactionRepository;
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
public class TransactionServiceImpl implements TransactionService{

    private final UserRepository userRepository;

    private final TransactionRepository transactionRepository;

    @Override
    public CreateTransactionResponseDto createTransaction(CreateTransactionRequestDto requestDto) {

        Optional<User> optionalUser = userRepository.findById(requestDto.getUserId());

        if (!optionalUser.isPresent()) {
            throw new ResourceNotFoundException("User not found");
        }

        User user = optionalUser.get();

        Transaction transaction = new Transaction();

        transaction.setCode(requestDto.getCode());
        transaction.setType(requestDto.getType());
        transaction.setBankCode(requestDto.getBankCode());
        transaction.setBankTranNo(requestDto.getBankTranNo());
        transaction.setCardType(requestDto.getCardType());
        transaction.setAmount(requestDto.getAmount());
        transaction.setContent(requestDto.getContent());
        transaction.setPayDate(requestDto.getPayDate());
        transaction.setPaymentStatus(PaymentStatus.valueOf(requestDto.getPaymentStatus()));
        transaction.setTransactionStatus(TransactionStatus.valueOf(requestDto.getTransactionStatus()));
        transaction.setUser(user);

        transactionRepository.save(transaction);

        CreateTransactionResponseDto responseDto = new CreateTransactionResponseDto();

        responseDto.setId(transaction.getId());
        responseDto.setCode(transaction.getCode());
        responseDto.setType(transaction.getType());
        responseDto.setBankCode(transaction.getBankCode());
        responseDto.setBankTranNo(transaction.getBankTranNo());
        responseDto.setCardType(transaction.getCardType());
        responseDto.setAmount(transaction.getAmount());
        responseDto.setContent(transaction.getContent());
        responseDto.setPayDate(transaction.getPayDate());
        responseDto.setPaymentStatus(transaction.getPaymentStatus().toString());
        responseDto.setTransactionStatus(transaction.getTransactionStatus().toString());

        return responseDto;
    }

//    @Override
//    public UpdateAccountResponseDto updateAccount(Long userId, UpdateAccountRequestDto updateAccountRequestDto) {
//
//        Optional<User> userOptional = userRepository.findById(userId);
//
//        if (!userOptional.isPresent()) {
//            throw new ResourceNotFoundException("User not found");
//        }
//
//        User user = userOptional.get();
//
//        user.setUsername(updateAccountRequestDto.getUsername());
//        user.setEmail(updateAccountRequestDto.getEmail());
//
//        if (updateAccountRequestDto.getStatus() != null) {
//            user.setStatus(UserStatus.valueOf(updateAccountRequestDto.getStatus().toUpperCase()));
//        } else {
//            throw new IllegalArgumentException("No enum");
//        }
//
//        user.setUpdatedAt(LocalDateTime.now());
//
//        Set<Role> roles = new HashSet<>();
//
//        for (String roleName : updateAccountRequestDto.getRoles()) {
//            Role role = roleRepository.findByName(roleName);
//
//            if (role == null) {
//                role = new Role();
//                role.setName(roleName);
//                roleRepository.save(role);
//            }
//
//            roles.add(role);
//        }
//
//        user.setRoles(roles);
//
//        userRepository.save(user);
//
//        UpdateAccountResponseDto responseDto = new UpdateAccountResponseDto();
//
//        responseDto.setId(user.getId());
//        responseDto.setUsername(user.getUsername());
//        responseDto.setEmail(user.getEmail());
//        responseDto.setRoles(user.getRoles().stream().map(Role::getName).collect(Collectors.toSet()));
//        responseDto.setStatus(user.getStatus().toString());
//        responseDto.setUpdatedAt(user.getUpdatedAt());
//
//        return responseDto;
//    }
//
//    @Override
//    public void deleteAccount(Long userId) {
//
//        Optional<User> userOptional = userRepository.findById(userId);
//
//        if (!userOptional.isPresent()) {
//            throw new ResourceNotFoundException("Account not found");
//        }
//
//        User user = userOptional.get();
//
//        user.setRoles(new HashSet<>());
//
//        userRepository.save(user);
//
//        userRepository.deleteById(userId);
//
//    }
//
//    @Override
//    public GetAccountByIdResponseDto getAccountById(Long userId) {
//
//        Optional<User> userOptional = userRepository.findById(userId);
//
//        if (!userOptional.isPresent()) {
//            throw new ResourceNotFoundException("User not found");
//        }
//
//        User user = userOptional.get();
//
//        GetAccountByIdResponseDto responseDto = new GetAccountByIdResponseDto();
//
//        responseDto.setId(user.getId());
//        responseDto.setUsername(user.getUsername());
//        responseDto.setPassword(user.getPassword());
//        responseDto.setEmail(user.getEmail());
//        responseDto.setRoles(user.getRoles().stream().map(Role::getName).collect(Collectors.toSet()));
//        responseDto.setStatus(user.getStatus().toString());
//        responseDto.setCreateAt(user.getCreatedAt());
//        responseDto.setUpdatedAt(user.getUpdatedAt());
//
//        return responseDto;
//    }
//
    @Override
    public List<GetAllTransactionsResponseDto> getAllTransactions(int page, int limit, String search, String paymentStatus) {
        // Calculate the offset based on page and limit
        int offset = (page - 1) * limit;

        // Fetch users from the repository with pagination
        Pageable pageable = PageRequest.of(page - 1, limit);

        // Create Specification for dynamic query based on search, role, and status parameters
        Specification<Transaction> spec = (root, query, cb) -> {
            Predicate predicate = cb.conjunction(); // Start with an "AND" conjunction

            // Add condition to search for username or email if search parameter is provided
            if (search != null && !search.isEmpty()) {
                Predicate codePredicate = cb.like(cb.lower(root.get("code")), "%" + search.toLowerCase() + "%");
                predicate = cb.or(codePredicate);
            }

            // Add condition to filter by role if role parameter is provided
            if (paymentStatus != null && !paymentStatus.isEmpty()) {
                predicate = cb.and(predicate, cb.equal(root.get("paymentStatus"), PaymentStatus.valueOf(paymentStatus.toUpperCase())));
            }
//
//            // Add condition to filter by status if status parameter is provided
//            if (status != null && !status.isEmpty()) {
//                predicate = cb.and(predicate, cb.equal(root.get("status"), UserStatus.valueOf(status.toUpperCase())));
//            }

            return predicate;
        };

        // Fetch users from the repository with pagination and dynamic query
        Page<Transaction> transactionPage = transactionRepository.findAll(spec, pageable);

        // Retrieve the content from the fetched page
        List<Transaction> transactions = transactionPage.getContent();

        // Check if the fetched list of users is empty
        if (transactions.isEmpty()) {
            throw new ResourceNotFoundException("No users found");
        }

        // Convert users to GetAllAccountsResponseDto
        List<GetAllTransactionsResponseDto> responseDtoList = transactions.stream()
                .map(transaction -> {
                    GetAllTransactionsResponseDto responseDto = new GetAllTransactionsResponseDto();
                    responseDto.setId(transaction.getId());
                    responseDto.setCode(transaction.getCode());
                    responseDto.setType(transaction.getType());
                    responseDto.setBankCode(transaction.getBankCode());
                    responseDto.setBankTranNo(transaction.getBankTranNo());
                    responseDto.setCardType(transaction.getCardType());
                    responseDto.setAmount(transaction.getAmount());
                    responseDto.setContent(transaction.getContent());
                    responseDto.setPayDate(transaction.getPayDate());
                    responseDto.setPaymentStatus(transaction.getPaymentStatus().toString());
                    responseDto.setTransactionStatus(transaction.getTransactionStatus().toString());

                    return responseDto;
                })
                .collect(Collectors.toList());

        // Return the responseDtoList
        return responseDtoList;
    }
}
