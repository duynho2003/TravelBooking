package com.example.city_tours.controller;

import com.example.city_tours.common.ApiErrorResponse;
import com.example.city_tours.common.ApiSuccessResponse;
import com.example.city_tours.common.ErrorCode;
import com.example.city_tours.dto.request.Hotel.CreateHotelRequestDto;
import com.example.city_tours.dto.request.Hotel.UpdateHotelRequestDto;
import com.example.city_tours.dto.request.Tour.CreateTourRequestDto;
import com.example.city_tours.dto.request.Tour.UpdateTourRequestDto;
import com.example.city_tours.dto.response.Hotel.CreateHotelResponseDto;
import com.example.city_tours.dto.response.Hotel.GetAllHotelsResponseDto;
import com.example.city_tours.dto.response.Hotel.GetHotelByIdResponseDto;
import com.example.city_tours.dto.response.Hotel.UpdateHotelResponseDto;
import com.example.city_tours.dto.response.Tour.CreateTourResponseDto;
import com.example.city_tours.dto.response.Tour.GetAllToursResponseDto;
import com.example.city_tours.dto.response.Tour.GetTourByIdResponseDto;
import com.example.city_tours.dto.response.Tour.UpdateTourResponseDto;
import com.example.city_tours.dto.response.User.PageResponseDto;
import com.example.city_tours.exception.ResourceNotFoundException;
import com.example.city_tours.exception.ServerErrorException;
import com.example.city_tours.repository.HotelRepository;
import com.example.city_tours.repository.TourRepository;
import com.example.city_tours.service.HotelService;
import com.example.city_tours.service.TourService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@AllArgsConstructor
@RestController
@RequestMapping("/api/v1/hotels")
public class HotelController {

    private HotelService hotelService;
    private final HotelRepository hotelRepository;

    @PreAuthorize("hasAuthority('CREATE_HOTEL')")
    @PostMapping("/create")
    public ResponseEntity<?> createHotel(@RequestBody CreateHotelRequestDto createHotelRequestDto) {
        try {
            CreateHotelResponseDto responseDto = hotelService.createHotel(createHotelRequestDto);

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(new ApiSuccessResponse<>(
                            HttpStatus.CREATED.value(),
                            "Created hotel successfully",
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
    @PutMapping("/{hotelId}")
    public ResponseEntity<?> updateHotel(@PathVariable Long hotelId, @RequestBody UpdateHotelRequestDto updateTourRequestDto) {
        try {
            UpdateHotelResponseDto responseDto = hotelService.updateHotel(hotelId, updateTourRequestDto);

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(new ApiSuccessResponse<>(
                            HttpStatus.CREATED.value(),
                            "Updated hotel successfully",
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
    @PreAuthorize("hasAuthority('READ_HOTEL')")
    @GetMapping("")
    public ResponseEntity<?> getAllHotels(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int limit
    ) {
        try {
            // Call userService to get a page of accounts
            List<GetAllHotelsResponseDto> responsePage = hotelService.getAllHotels(page, limit);

            // Count total users
            long totalTours = hotelRepository.count();

            // Calculate skip (number of records skipped)
            int skip = (page - 1) * limit;

            // Prepare the response structure
            PageResponseDto<GetAllHotelsResponseDto> pageResponseDto = new PageResponseDto<>();
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
    @GetMapping("/{hotelId}")
    public ResponseEntity<?> getHotelById(@PathVariable Long hotelId) {
        try {
            GetHotelByIdResponseDto responseDto = hotelService.getHotelById(hotelId);
            return ResponseEntity
                    .status(HttpStatus.OK)
                    .body(new ApiSuccessResponse<>(
                            HttpStatus.OK.value(),
                            "Get hotel by id successfully",
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
