package com.example.city_tours.controller;

import com.example.city_tours.common.ApiErrorResponse;
import com.example.city_tours.common.ApiSuccessResponse;
import com.example.city_tours.common.ErrorCode;
import com.example.city_tours.dto.request.Tour.CreateScheduleDaysTimeRequestDto;
import com.example.city_tours.dto.request.Tour.CreateScheduleRequestDto;
import com.example.city_tours.dto.request.Tour.CreateTourRequestDto;
import com.example.city_tours.dto.request.Tour.UpdateTourRequestDto;
import com.example.city_tours.dto.request.Website.CreateInfoRequestDto;
import com.example.city_tours.dto.request.Website.UpdateInfoRequestDto;
import com.example.city_tours.dto.response.Tour.CreateTourResponseDto;
import com.example.city_tours.dto.response.Tour.GetAllToursResponseDto;
import com.example.city_tours.dto.response.Tour.GetTourByIdResponseDto;
import com.example.city_tours.dto.response.Tour.UpdateTourResponseDto;
import com.example.city_tours.dto.response.User.GetAccountByIdResponseDto;
import com.example.city_tours.dto.response.User.GetAllAccountsResponseDto;
import com.example.city_tours.dto.response.User.PageResponseDto;
import com.example.city_tours.dto.response.Website.CreateInfoResponseDto;
import com.example.city_tours.dto.response.Website.GetInfoResponseDto;
import com.example.city_tours.dto.response.Website.UpdateInfoResponseDto;
import com.example.city_tours.entity.Schedule;
import com.example.city_tours.exception.ResourceNotFoundException;
import com.example.city_tours.exception.ServerErrorException;
import com.example.city_tours.repository.TourRepository;
import com.example.city_tours.service.TourService;
import com.example.city_tours.service.WebsiteService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;

@AllArgsConstructor
@RestController
@RequestMapping("/api/v1/tours")
public class TourController {

    private TourService tourService;
    private final TourRepository tourRepository;

    @PreAuthorize("hasAuthority('CREATE_TOUR')")
    @PostMapping("/create")
    public ResponseEntity<?> createTour( @RequestBody CreateTourRequestDto createTourRequestDto ) {
        try {
            CreateTourResponseDto responseDto = tourService.createTour(createTourRequestDto);

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(new ApiSuccessResponse<>(
                            HttpStatus.CREATED.value(),
                            "Created tour successfully",
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

    @PreAuthorize("hasAuthority('UPDATE_TOUR')")
    @PutMapping("/{tourId}")
    public ResponseEntity<?> updateTour(@PathVariable Long tourId, @RequestBody UpdateTourRequestDto updateTourRequestDto) {
        try {
            UpdateTourResponseDto responseDto = tourService.updateTour(tourId, updateTourRequestDto);

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(new ApiSuccessResponse<>(
                            HttpStatus.CREATED.value(),
                            "Updated tour successfully",
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

    @PreAuthorize("hasAuthority('UPDATE_TOUR')")
    @DeleteMapping("/{tourId}")
    public ResponseEntity<?> deleteTour(@PathVariable Long tourId) {
        try {
            tourService.deleteTour(tourId);

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(new ApiSuccessResponse<>(
                            HttpStatus.CREATED.value(),
                            "Deleted tour successfully",
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

    @PreAuthorize("hasAuthority('READ_TOUR')")
    @GetMapping("")
    public ResponseEntity<?> getAllTours(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int limit
    ) {
        try {
            // Call userService to get a page of accounts
            List<GetAllToursResponseDto> responsePage = tourService.getAllTours(page, limit);

            // Count total users
            long totalTours = tourRepository.count();

            // Calculate skip (number of records skipped)
            int skip = (page - 1) * limit;

            // Prepare the response structure
            PageResponseDto<GetAllToursResponseDto> pageResponseDto = new PageResponseDto<>();
            pageResponseDto.setData(responsePage);
            pageResponseDto.setPage(page);
            pageResponseDto.setLimit(limit);
            pageResponseDto.setSkip(skip);
            pageResponseDto.setTotals(totalTours);

            // Return success response
            return ResponseEntity
                    .status(HttpStatus.OK)
                    .body(new ApiSuccessResponse<>(
                            HttpStatus.OK.value(),
                            "Get all tours successfully",
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

    @PreAuthorize("hasAuthority('READ_TOUR')")
    @GetMapping("/{tourId}")
    public ResponseEntity<?> getTourById(@PathVariable Long tourId) {
        try {
            GetTourByIdResponseDto responseDto = tourService.getTourById(tourId);
            return ResponseEntity
                    .status(HttpStatus.OK)
                    .body(new ApiSuccessResponse<>(
                            HttpStatus.OK.value(),
                            "Get tour by id successfully",
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

}
