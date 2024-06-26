package com.example.city_tours.controller;

import com.example.city_tours.common.ApiErrorResponse;
import com.example.city_tours.common.ApiSuccessResponse;
import com.example.city_tours.common.ErrorCode;
import com.example.city_tours.dto.request.User.CreateAccountRequestDto;
import com.example.city_tours.dto.request.User.UpdateAccountRequestDto;
import com.example.city_tours.dto.response.User.*;
import com.example.city_tours.exception.EmailAlreadyExistsException;
import com.example.city_tours.exception.ResourceNotFoundException;
import com.example.city_tours.exception.ServerErrorException;
import com.example.city_tours.exception.UsernameAlreadyExistsException;
import com.example.city_tours.repository.UserRepository;
import com.example.city_tours.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@AllArgsConstructor
@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    private UserService userService;
    private final UserRepository userRepository;

    @PreAuthorize("hasAuthority('CREATE_ACCOUNT')")
    @PostMapping("")
    public ResponseEntity<?> createAccount(@RequestBody CreateAccountRequestDto createAccountRequestDto) {
        try {
            CreateAccountResponseDto responseDto = userService.createAccount(createAccountRequestDto);
            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(new ApiSuccessResponse<>(
                            HttpStatus.CREATED.value(),
                            "Account created successfully",
                            responseDto
                    ));
        } catch (UsernameAlreadyExistsException e) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(new ApiErrorResponse(
                            HttpStatus.CONFLICT.value(),
                            e.getMessage(),
                            ErrorCode.USER_ALREADY_EXISTS,
                            "http://localhost:5050/docs/errors/1001"
                    ));
        } catch (EmailAlreadyExistsException e) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(new ApiErrorResponse(
                            HttpStatus.CONFLICT.value(),
                            e.getMessage(),
                            ErrorCode.EMAIL_ALREADY_EXISTS,
                            "http://localhost:5050/docs/errors/1002"
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

    @PreAuthorize("hasAuthority('UPDATE_ACCOUNT')")
    @PutMapping("/{userId}")
    public ResponseEntity<?> updateAccount(@PathVariable Long userId, @RequestBody UpdateAccountRequestDto updateAccountRequestDto) {
        try {
            UpdateAccountResponseDto responseDto = userService.updateAccount(userId, updateAccountRequestDto);
            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(new ApiSuccessResponse<>(
                            HttpStatus.CREATED.value(),
                            "Account updated successfully",
                            responseDto
                    ));
        } catch (UsernameAlreadyExistsException e) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(new ApiErrorResponse(
                            HttpStatus.CONFLICT.value(),
                            e.getMessage(),
                            ErrorCode.USER_ALREADY_EXISTS,
                            "http://localhost:5050/docs/errors/1001"
                    ));
        } catch (EmailAlreadyExistsException e) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(new ApiErrorResponse(
                            HttpStatus.CONFLICT.value(),
                            e.getMessage(),
                            ErrorCode.EMAIL_ALREADY_EXISTS,
                            "http://localhost:5050/docs/errors/1002"
                    ));
        } catch (IllegalArgumentException e) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(new ApiErrorResponse(
                            HttpStatus.NOT_FOUND.value(),
                            e.getMessage(),
                            ErrorCode.NOT_FOUND,
                            "http://localhost:5050/docs/errors/1015"
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

    @PreAuthorize("hasAuthority('UPDATE_ACCOUNT')")
    @DeleteMapping("/{userId}")
    public ResponseEntity<?> deleteAccount(@PathVariable Long userId) {
        try {
            userService.deleteAccount(userId);

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(new ApiSuccessResponse<>(
                            HttpStatus.CREATED.value(),
                            "Deleted account successfully",
                            null
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

    @PreAuthorize("hasAuthority('READ_ACCOUNT')")
    @GetMapping("/{userId}")
    public ResponseEntity<?> getAccountById(@PathVariable Long userId) {
        try {
            GetAccountByIdResponseDto responseDto = userService.getAccountById(userId);
            return ResponseEntity
                    .status(HttpStatus.OK)
                    .body(new ApiSuccessResponse<>(
                            HttpStatus.OK.value(),
                            "Get account by id successfully",
                            responseDto
                    ));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(new ApiErrorResponse(
                            HttpStatus.NOT_FOUND.value(),
                            e.getMessage(),
                            ErrorCode.NOT_FOUND,
                            "http://localhost:5050/docs/errors/1015"
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

    @PreAuthorize("hasAuthority('READ_ACCOUNT')")
    @GetMapping("")
    public ResponseEntity<?> getAllAccounts(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int limit
    ) {
        try {
            // Call userService to get a page of accounts
            List<GetAllAccountsResponseDto> responsePage = userService.getAllAccounts(page, limit);

            // Count total users
            long totalUsers = userRepository.count();

            // Calculate skip (number of records skipped)
            int skip = (page - 1) * limit;

            // Prepare the response structure
            PageResponseDto<GetAllAccountsResponseDto> pageResponseDto = new PageResponseDto<>();
            pageResponseDto.setData(responsePage);
            pageResponseDto.setPage(page);
            pageResponseDto.setLimit(limit);
            pageResponseDto.setSkip(skip);
            pageResponseDto.setTotals(totalUsers);

            // Return success response
            return ResponseEntity
                    .status(HttpStatus.OK)
                    .body(new ApiSuccessResponse<>(
                            HttpStatus.OK.value(),
                            "Get all accounts successfully",
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
