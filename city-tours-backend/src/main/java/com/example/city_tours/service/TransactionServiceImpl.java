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
import com.example.city_tours.repository.*;
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
    private final RoomBookingRepository roomBookingRepository;
    private final TourBookingRepository tourBookingRepository;

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
        transaction.setCreatedAt(LocalDateTime.now());
        transaction.setUser(user);

        transactionRepository.save(transaction);

        if (transaction.getTransactionStatus() == TransactionStatus.COMPLETED) {
            String content = transaction.getContent();
            String[] parts = content.split(" ");
            String type = parts[0] + " " + parts[1]; // BOOKING ROOM hoặc BOOKING TOUR
            Long id = Long.parseLong(parts[parts.length - 1]); // ID ở cuối cùng

            Object booking = null;

            if ("BOOKING ROOM".equals(type)) {
                // Tìm kiếm trong bảng roomBookings
                booking = roomBookingRepository.findById(id).orElse(null);
            } else if ("BOOKING TOUR".equals(type)) {
                // Tìm kiếm trong bảng tourBookings
                booking = tourBookingRepository.findById(id).orElse(null);
            }

            if (booking != null) {
                EmailService.sendBookingDetailsEmail(user.getEmail(), booking);
            }
        }

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
