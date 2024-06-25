package com.example.city_tours.controller;

import com.example.city_tours.common.ApiErrorResponse;
import com.example.city_tours.common.ApiSuccessResponse;
import com.example.city_tours.common.ErrorCode;
import com.example.city_tours.dto.request.Auth.LoginRequestDto;
import com.example.city_tours.dto.request.Auth.RegisterRequestDto;
import com.example.city_tours.dto.response.Auth.LoginResponseDto;
import com.example.city_tours.dto.response.Auth.RegisterResponseDto;
import com.example.city_tours.exception.*;
import com.example.city_tours.service.AuthService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@AllArgsConstructor
@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequestDto registerRequestDto) {
        try {
            RegisterResponseDto responseDto = authService.register(registerRequestDto);
            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(new ApiSuccessResponse<>(
                            HttpStatus.CREATED.value(),
                            "User registered successfully",
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

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDto loginRequestDto) {
        try {
            LoginResponseDto responseDto = authService.login(loginRequestDto);
            return ResponseEntity
                    .status(HttpStatus.OK)
                    .body(new ApiSuccessResponse<>(
                            HttpStatus.OK.value(),
                            "User logged in successfully",
                            responseDto
                    ));
        } catch (InvalidUsernameOrPasswordException e) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(new ApiErrorResponse(
                            HttpStatus.UNAUTHORIZED.value(),
                            e.getMessage(),
                            ErrorCode.INVALID_CREDENTIALS,
                            "http://localhost:5050/docs/errors/1010"
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

    @GetMapping("/users")
    public ResponseEntity<?> getUserByUserId() {
        System.out.println("getUserByUserId api");
        return ResponseEntity.ok("getUserByUserId");
    }
}
