package com.example.city_tours.controller;

import com.example.city_tours.common.ApiErrorResponse;
import com.example.city_tours.common.ApiSuccessResponse;
import com.example.city_tours.common.ErrorCode;
import com.example.city_tours.dto.request.Transaction.CreateTransactionRequestDto;
import com.example.city_tours.dto.request.User.CreateAccountRequestDto;
import com.example.city_tours.dto.request.User.UpdateAccountRequestDto;
import com.example.city_tours.dto.response.Transaction.CreateTransactionResponseDto;
import com.example.city_tours.dto.response.Transaction.GetAllTransactionsResponseDto;
import com.example.city_tours.dto.response.User.*;
import com.example.city_tours.exception.EmailAlreadyExistsException;
import com.example.city_tours.exception.ResourceNotFoundException;
import com.example.city_tours.exception.ServerErrorException;
import com.example.city_tours.exception.UsernameAlreadyExistsException;
import com.example.city_tours.repository.TransactionRepository;
import com.example.city_tours.repository.UserRepository;
import com.example.city_tours.service.TransactionService;
import com.example.city_tours.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@AllArgsConstructor
@RestController
@RequestMapping("/api/v1/transactions")
public class TransactionController {

    private TransactionService transactionService;
    private final TransactionRepository transactionRepository;

    @PreAuthorize("hasAnyRole('ROLE_CUSTOMER', 'ROLE_STAFF', 'ROLE_ADMIN')")
    @PostMapping("")
    public ResponseEntity<?> createTransaction(@RequestBody CreateTransactionRequestDto createTransactionRequestDto) {
        try {
            CreateTransactionResponseDto responseDto = transactionService.createTransaction(createTransactionRequestDto);
            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(new ApiSuccessResponse<>(
                            HttpStatus.CREATED.value(),
                            "Transaction created successfully",
                            responseDto
                    ));
        } catch (ServerErrorException e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiErrorResponse(
                            HttpStatus.INTERNAL_SERVER_ERROR.value(),
                            e.getMessage(),
                            ErrorCode.INTERNAL_SERVER_ERROR,
                            "http://localhost:5050/docs/errors/1012"
                    ));
        }
    }

//    @PreAuthorize("hasAuthority('UPDATE_ACCOUNT')")
//    @PutMapping("/{userId}")
//    public ResponseEntity<?> updateAccount(@PathVariable Long userId, @RequestBody UpdateAccountRequestDto updateAccountRequestDto) {
//        try {
//            UpdateAccountResponseDto responseDto = userService.updateAccount(userId, updateAccountRequestDto);
//            return ResponseEntity
//                    .status(HttpStatus.CREATED)
//                    .body(new ApiSuccessResponse<>(
//                            HttpStatus.CREATED.value(),
//                            "Account updated successfully",
//                            responseDto
//                    ));
//        } catch (UsernameAlreadyExistsException e) {
//            return ResponseEntity
//                    .status(HttpStatus.CONFLICT)
//                    .body(new ApiErrorResponse(
//                            HttpStatus.CONFLICT.value(),
//                            e.getMessage(),
//                            ErrorCode.USER_ALREADY_EXISTS,
//                            "http://localhost:5050/docs/errors/1001"
//                    ));
//        } catch (EmailAlreadyExistsException e) {
//            return ResponseEntity
//                    .status(HttpStatus.CONFLICT)
//                    .body(new ApiErrorResponse(
//                            HttpStatus.CONFLICT.value(),
//                            e.getMessage(),
//                            ErrorCode.EMAIL_ALREADY_EXISTS,
//                            "http://localhost:5050/docs/errors/1002"
//                    ));
//        } catch (IllegalArgumentException e) {
//            return ResponseEntity
//                    .status(HttpStatus.NOT_FOUND)
//                    .body(new ApiErrorResponse(
//                            HttpStatus.NOT_FOUND.value(),
//                            e.getMessage(),
//                            ErrorCode.NOT_FOUND,
//                            "http://localhost:5050/docs/errors/1015"
//                    ));
//        } catch (ServerErrorException e) {
//            return ResponseEntity
//                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
//                    .body(new ApiErrorResponse(
//                            HttpStatus.INTERNAL_SERVER_ERROR.value(),
//                            e.getMessage(),
//                            ErrorCode.INTERNAL_SERVER_ERROR,
//                            "http://localhost:5050/docs/errors/1012"
//                    ));
//        }
//    }
//
//    @PreAuthorize("hasAuthority('UPDATE_ACCOUNT')")
//    @DeleteMapping("/{userId}")
//    public ResponseEntity<?> deleteAccount(@PathVariable Long userId) {
//        try {
//            userService.deleteAccount(userId);
//
//            return ResponseEntity
//                    .status(HttpStatus.CREATED)
//                    .body(new ApiSuccessResponse<>(
//                            HttpStatus.CREATED.value(),
//                            "Deleted account successfully",
//                            null
//                    ));
//        } catch (ServerErrorException e) {
//            return ResponseEntity
//                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
//                    .body(new ApiErrorResponse(
//                            HttpStatus.INTERNAL_SERVER_ERROR.value(),
//                            e.getMessage(),
//                            ErrorCode.INTERNAL_SERVER_ERROR,
//                            "http://localhost:5050/docs/errors/1012"
//                    ));
//        }
//    }
//
//    @PreAuthorize("hasAuthority('READ_ACCOUNT')")
//    @GetMapping("/{userId}")
//    public ResponseEntity<?> getAccountById(@PathVariable Long userId) {
//        try {
//            GetAccountByIdResponseDto responseDto = userService.getAccountById(userId);
//            return ResponseEntity
//                    .status(HttpStatus.OK)
//                    .body(new ApiSuccessResponse<>(
//                            HttpStatus.OK.value(),
//                            "Get account by id successfully",
//                            responseDto
//                    ));
//        } catch (ResourceNotFoundException e) {
//            return ResponseEntity
//                    .status(HttpStatus.NOT_FOUND)
//                    .body(new ApiErrorResponse(
//                            HttpStatus.NOT_FOUND.value(),
//                            e.getMessage(),
//                            ErrorCode.NOT_FOUND,
//                            "http://localhost:5050/docs/errors/1015"
//                    ));
//        } catch (ServerErrorException e) {
//            return ResponseEntity
//                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
//                    .body(new ApiErrorResponse(
//                            HttpStatus.INTERNAL_SERVER_ERROR.value(),
//                            e.getMessage(),
//                            ErrorCode.INTERNAL_SERVER_ERROR,
//                            "http://localhost:5050/docs/errors/1012"
//                    ));
//        }
//    }
//
    @PreAuthorize("hasAnyRole('ROLE_STAFF', 'ROLE_ADMIN')")
    @GetMapping("")
    public ResponseEntity<?> getAllTransactions(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam(defaultValue = "") String search,
            @RequestParam(defaultValue = "") String paymentStatus
//            @RequestParam(defaultValue = "") String status
    ) {
        try {
            // Call userService to get a page of accounts
            List<GetAllTransactionsResponseDto> responsePage = transactionService.getAllTransactions(page, limit, search, paymentStatus);

            // Count total users
            long totalTransactions = transactionRepository.count();

            // Calculate skip (number of records skipped)
            int skip = (page - 1) * limit;

            // Prepare the response structure
            PageResponseDto<GetAllTransactionsResponseDto> pageResponseDto = new PageResponseDto<>();
            pageResponseDto.setData(responsePage);
            pageResponseDto.setPage(page);
            pageResponseDto.setLimit(limit);
            pageResponseDto.setSkip(skip);
            pageResponseDto.setTotals(totalTransactions);

            // Return success response
            return ResponseEntity
                    .status(HttpStatus.OK)
                    .body(new ApiSuccessResponse<>(
                            HttpStatus.OK.value(),
                            "Get all transactions successfully",
                            pageResponseDto
                    ));
        } catch (ResourceNotFoundException e) {
            // Return error response for resource not found
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(new ApiErrorResponse(
                            HttpStatus.NOT_FOUND.value(),
                            e.getMessage(),
                            ErrorCode.NOT_FOUND,
                            "http://localhost:5050/docs/errors/1015"
                    ));
        } catch (ServerErrorException e) {
            // Return error response for server error
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiErrorResponse(
                            HttpStatus.INTERNAL_SERVER_ERROR.value(),
                            e.getMessage(),
                            ErrorCode.INTERNAL_SERVER_ERROR,
                            "http://localhost:5050/docs/errors/1012"
                    ));
        }
    }

}
