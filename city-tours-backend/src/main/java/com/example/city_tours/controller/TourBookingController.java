package com.example.city_tours.controller;

import com.example.city_tours.common.ApiErrorResponse;
import com.example.city_tours.common.ApiSuccessResponse;
import com.example.city_tours.common.ErrorCode;
import com.example.city_tours.dto.request.TourBooking.CreateTourBookingRequestDto;
import com.example.city_tours.dto.request.TourRoomBooking.CreateTourRoomBookingRequestDto;
import com.example.city_tours.dto.response.TourBooking.CreateTourBookingResponseDto;
import com.example.city_tours.dto.response.TourBooking.GetAllTourBookingsResponseDto;
import com.example.city_tours.dto.response.TourRoomBooking.CreateTourRoomBookingResponseDto;
import com.example.city_tours.dto.response.User.PageResponseDto;
import com.example.city_tours.exception.ResourceNotFoundException;
import com.example.city_tours.exception.ServerErrorException;
import com.example.city_tours.repository.TourBookingRepository;
import com.example.city_tours.service.TourBookingService;
import com.example.city_tours.service.TourRoomBookingService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@AllArgsConstructor
@RestController
@RequestMapping("/api/v1/tourBookings")
public class TourBookingController {

    private TourBookingService tourBookingService;
    private final TourBookingRepository tourBookingRepository;

    @PreAuthorize("hasAnyRole('ROLE_CUSTOMER', 'ROLE_STAFF', 'ROLE_ADMIN')")
    @PostMapping("/create")
    public ResponseEntity<?> createTourBooking(@RequestBody CreateTourBookingRequestDto createTourBookingRequestDto) {
        try {
            CreateTourBookingResponseDto responseDto = tourBookingService.createTourBooking(createTourBookingRequestDto);

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(new ApiSuccessResponse<>(
                            HttpStatus.CREATED.value(),
                            "Created tour room booking successfully",
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

//    @PreAuthorize("hasAuthority('UPDATE_TOUR')")
//    @PutMapping("/{tourBookingId}")
//    public ResponseEntity<?> updateTourBooking(@PathVariable Long tourId, @RequestBody UpdateTourRequestDto updateTourRequestDto) {
//        try {
//            UpdateTourResponseDto responseDto = tourService.updateTour(tourId, updateTourRequestDto);
//
//            return ResponseEntity
//                    .status(HttpStatus.CREATED)
//                    .body(new ApiSuccessResponse<>(
//                            HttpStatus.CREATED.value(),
//                            "Updated tour successfully",
//                            responseDto
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
//    @PreAuthorize("hasAuthority('UPDATE_TOUR')")
//    @DeleteMapping("/{tourId}")
//    public ResponseEntity<?> deleteTour(@PathVariable Long tourId) {
//        try {
//            tourService.deleteTour(tourId);
//
//            return ResponseEntity
//                    .status(HttpStatus.CREATED)
//                    .body(new ApiSuccessResponse<>(
//                            HttpStatus.CREATED.value(),
//                            "Deleted tour successfully",
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


    @PreAuthorize("hasAuthority('READ_TOUR')")
    @GetMapping("")
    public ResponseEntity<?> getAllTourBookings(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int limit
    ) {
        try {
            // Call userService to get a page of accounts
            List<GetAllTourBookingsResponseDto> responsePage = tourBookingService.getAllTourBookings(page, limit);

            // Count total users
            long totalTourBookings = tourBookingRepository.count();

            // Calculate skip (number of records skipped)
            int skip = (page - 1) * limit;

            // Prepare the response structure
            PageResponseDto<GetAllTourBookingsResponseDto> pageResponseDto = new PageResponseDto<>();
            pageResponseDto.setData(responsePage);
            pageResponseDto.setPage(page);
            pageResponseDto.setLimit(limit);
            pageResponseDto.setSkip(skip);
            pageResponseDto.setTotals(totalTourBookings);

            // Return success response
            return ResponseEntity
                    .status(HttpStatus.OK)
                    .body(new ApiSuccessResponse<>(
                            HttpStatus.OK.value(),
                            "Get all tour bookings successfully",
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
//
////    @PreAuthorize("hasAuthority('READ_TOUR')")
//    @GetMapping("/{tourId}")
//    public ResponseEntity<?> getTourById(@PathVariable Long tourId) {
//        try {
//            GetTourByIdResponseDto responseDto = tourService.getTourById(tourId);
//            return ResponseEntity
//                    .status(HttpStatus.OK)
//                    .body(new ApiSuccessResponse<>(
//                            HttpStatus.OK.value(),
//                            "Get tour by id successfully",
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

}
