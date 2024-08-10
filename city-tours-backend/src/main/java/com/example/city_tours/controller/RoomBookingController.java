package com.example.city_tours.controller;

import com.example.city_tours.common.ApiErrorResponse;
import com.example.city_tours.common.ApiSuccessResponse;
import com.example.city_tours.common.ErrorCode;
import com.example.city_tours.dto.request.RoomBooking.CreateRoomBookingRequestDto;
import com.example.city_tours.dto.request.RoomBooking.UpdateStatusRoomBookingRequestDto;
import com.example.city_tours.dto.request.TourBooking.UpdateStatusTourBookingRequestDto;
import com.example.city_tours.dto.request.TourRoomBooking.CreateTourRoomBookingRequestDto;
import com.example.city_tours.dto.response.RoomBooking.CreateRoomBookingResponseDto;
import com.example.city_tours.dto.response.RoomBooking.UpdateStatusRoomBookingResponseDto;
import com.example.city_tours.dto.response.TourBooking.UpdateStatusTourBookingResponseDto;
import com.example.city_tours.dto.response.TourRoomBooking.CreateTourRoomBookingResponseDto;
import com.example.city_tours.dto.response.User.PageResponseDto;
import com.example.city_tours.exception.ResourceNotFoundException;
import com.example.city_tours.exception.ServerErrorException;
import com.example.city_tours.service.RoomBookingService;
import com.example.city_tours.service.TourRoomBookingService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@AllArgsConstructor
@RestController
@RequestMapping("/api/v1/roomBookings")
public class RoomBookingController {

    private RoomBookingService roomBookingService;

    @PostMapping("/create")
    public ResponseEntity<?> createRoomBooking(@RequestBody CreateRoomBookingRequestDto createRoomBookingRequestDto) {
        try {
            CreateRoomBookingResponseDto responseDto = roomBookingService.createRoomBooking(createRoomBookingRequestDto);

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(new ApiSuccessResponse<>(
                            HttpStatus.CREATED.value(),
                            "Created room booking successfully",
                            responseDto
                    ));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(new ApiErrorResponse(
                            HttpStatus.NOT_FOUND.value(),
                            e.getMessage(),
                            ErrorCode.NOT_FOUND,
                            "http://localhost:5050/docs/errors/1012"
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

    @PreAuthorize("hasAnyRole('ROLE_STAFF', 'ROLE_ADMIN')")
    @GetMapping("")
    public ResponseEntity<?> getAllRoomBookings(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam(defaultValue = "") String hotelName,
            @RequestParam(required = false) Integer hotelId
    ) {
        try {
            // Call userService to get a page of accounts
            PageResponseDto responsePage = roomBookingService.getAllRoomBookings(page, limit, hotelName, hotelId);

            // Return success response
            return ResponseEntity
                    .status(HttpStatus.OK)
                    .body(new ApiSuccessResponse<>(
                            HttpStatus.OK.value(),
                            "Get all room bookings successfully",
                            responsePage
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

    @PreAuthorize("hasAnyRole('ROLE_CUSTOMER', 'ROLE_STAFF', 'ROLE_ADMIN')")
    @GetMapping("/{userId}")
    public ResponseEntity<?> getAllRoomBookingsByUserId(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int limit
    ) {
        try {
            // Call userService to get a page of accounts
            PageResponseDto responsePage = roomBookingService.getRoomBookingsByUserId(userId, page, limit);

            // Return success response
            return ResponseEntity
                    .status(HttpStatus.OK)
                    .body(new ApiSuccessResponse<>(
                            HttpStatus.OK.value(),
                            "Get all room bookings by userId successfully",
                            responsePage
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

    @PreAuthorize("hasAnyRole('ROLE_STAFF', 'ROLE_ADMIN')")
    @PatchMapping("/update-status/{roomBookingId}")
    public ResponseEntity<?> updateStatusRoomBooking(@PathVariable Long roomBookingId, @RequestBody UpdateStatusRoomBookingRequestDto requestDto) {
        try {
            UpdateStatusRoomBookingResponseDto responseDto = roomBookingService.updateStatusRoomBooking(roomBookingId, requestDto);

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(new ApiSuccessResponse<>(
                            HttpStatus.CREATED.value(),
                            "Updated room booking successfully",
                            responseDto
                    ));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(new ApiErrorResponse(
                            HttpStatus.NOT_FOUND.value(),
                            e.getMessage(),
                            ErrorCode.NOT_FOUND,
                            "http://localhost:5050/docs/errors/1012"
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

}
