package com.example.city_tours.controller;

import com.example.city_tours.common.ApiErrorResponse;
import com.example.city_tours.common.ApiSuccessResponse;
import com.example.city_tours.common.ErrorCode;
import com.example.city_tours.dto.request.Hotel.CreateHotelRequestDto;
import com.example.city_tours.dto.request.Room.CreateRoomRequestDto;
import com.example.city_tours.dto.request.Room.UpdateRoomRequestDto;
import com.example.city_tours.dto.response.Hotel.CreateHotelResponseDto;
import com.example.city_tours.dto.response.Hotel.GetAllHotelsResponseDto;
import com.example.city_tours.dto.response.Room.CreateRoomResponseDto;
import com.example.city_tours.dto.response.Room.GetRoomByIdResponseDto;
import com.example.city_tours.dto.response.Room.UpdateRoomResponseDto;
import com.example.city_tours.dto.response.User.PageResponseDto;
import com.example.city_tours.exception.ResourceNotFoundException;
import com.example.city_tours.exception.ServerErrorException;
import com.example.city_tours.repository.HotelRepository;
import com.example.city_tours.service.HotelService;
import com.example.city_tours.service.RoomService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@AllArgsConstructor
@RestController
@RequestMapping("/api/v1/rooms")
public class RoomController {

    private RoomService roomService;
    private HotelService hotelService;
    private final HotelRepository hotelRepository;

    @PreAuthorize("hasAuthority('CREATE_HOTEL')")
    @PostMapping("/hotels/{hotelId}/create")
    public ResponseEntity<?> createRoom(@PathVariable Long hotelId, @RequestBody CreateRoomRequestDto createRoomRequestDto) {
        try {
            CreateRoomResponseDto responseDto = roomService.createRoom(hotelId, createRoomRequestDto);

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(new ApiSuccessResponse<>(
                            HttpStatus.CREATED.value(),
                            "Created room successfully",
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
    @PutMapping("/{roomId}")
    public ResponseEntity<?> updateRoom(@PathVariable Long roomId, @RequestBody UpdateRoomRequestDto updateRoomRequestDto) {
        try {
            UpdateRoomResponseDto responseDto = roomService.updateRoom(roomId, updateRoomRequestDto);

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(new ApiSuccessResponse<>(
                            HttpStatus.CREATED.value(),
                            "Updated room successfully",
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
    @DeleteMapping("/{roomId}")
    public ResponseEntity<?> deleteRoom(@PathVariable Long roomId) {
        try {
            roomService.deleteRoom(roomId);

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(new ApiSuccessResponse<>(
                            HttpStatus.CREATED.value(),
                            "Deleted room successfully",
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
    @GetMapping("/{roomId}")
    public ResponseEntity<?> getRoomById(@PathVariable Long roomId) {
        try {
            GetRoomByIdResponseDto responseDto = roomService.getRoomById(roomId);
            return ResponseEntity
                    .status(HttpStatus.OK)
                    .body(new ApiSuccessResponse<>(
                            HttpStatus.OK.value(),
                            "Get room by id successfully",
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
