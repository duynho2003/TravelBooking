package com.example.city_tours.controller;

import com.example.city_tours.common.ApiErrorResponse;
import com.example.city_tours.common.ApiSuccessResponse;
import com.example.city_tours.common.ErrorCode;
import com.example.city_tours.dto.request.Region.CreateRegionRequestDto;
import com.example.city_tours.dto.request.Region.UpdateRegionRequestDto;
import com.example.city_tours.dto.request.Transaction.CreateTransactionRequestDto;
import com.example.city_tours.dto.response.Region.CreateRegionResponseDto;
import com.example.city_tours.dto.response.Region.GetAllRegionsResponseDto;
import com.example.city_tours.dto.response.Region.GetRegionByIdResponseDto;
import com.example.city_tours.dto.response.Region.UpdateRegionResponseDto;
import com.example.city_tours.dto.response.Transaction.CreateTransactionResponseDto;
import com.example.city_tours.dto.response.Transaction.GetAllTransactionsResponseDto;
import com.example.city_tours.dto.response.User.PageResponseDto;
import com.example.city_tours.exception.ResourceNotFoundException;
import com.example.city_tours.exception.ServerErrorException;
import com.example.city_tours.repository.RegionRepository;
import com.example.city_tours.repository.TransactionRepository;
import com.example.city_tours.service.RegionService;
import com.example.city_tours.service.TransactionService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@AllArgsConstructor
@RestController
@RequestMapping("/api/v1/regions")
public class RegionController {

    private RegionService regionService;
    private final RegionRepository regionRepository;

    @PreAuthorize("hasAuthority('CREATE_ACCOUNT')")
    @PostMapping("")
    public ResponseEntity<?> createRegion(@RequestBody CreateRegionRequestDto createRegionRequestDto) {
        try {
            CreateRegionResponseDto responseDto = regionService.createRegion(createRegionRequestDto);
            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(new ApiSuccessResponse<>(
                            HttpStatus.CREATED.value(),
                            "Region created successfully",
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

    @PreAuthorize("hasAuthority('CREATE_ACCOUNT')")
    @GetMapping("/{regionId}")
    public ResponseEntity<?> getRegionById(@PathVariable Long regionId) {
        try {
            GetRegionByIdResponseDto responseDto = regionService.getRegionById(regionId);
            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(new ApiSuccessResponse<>(
                            HttpStatus.CREATED.value(),
                            "Region created successfully",
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

    @PreAuthorize("hasAuthority('UPDATE_ACCOUNT')")
    @PutMapping("/{regionId}")
    public ResponseEntity<?> updateRegion(@PathVariable Long regionId, @RequestBody UpdateRegionRequestDto updateRegionRequestDto) {
        try {
            UpdateRegionResponseDto responseDto = regionService.updateRegion(regionId, updateRegionRequestDto);
            return ResponseEntity
                    .status(HttpStatus.OK)
                    .body(new ApiSuccessResponse<>(
                            HttpStatus.OK.value(),
                            "Region updated successfully",
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
    @PreAuthorize("hasAuthority('READ_ACCOUNT')")
    @GetMapping("")
    public ResponseEntity<?> getAllRegions(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int limit
//            @RequestParam(defaultValue = "") String search,
//            @RequestParam(defaultValue = "") String paymentStatus
//            @RequestParam(defaultValue = "") String status
    ) {
        try {
            // Call userService to get a page of accounts
            List<GetAllRegionsResponseDto> responsePage = regionService.getAllRegions(page, limit);

            // Count total users
            long totalRegions = regionRepository.count();

            // Calculate skip (number of records skipped)
            int skip = (page - 1) * limit;

            // Prepare the response structure
            PageResponseDto<GetAllRegionsResponseDto> pageResponseDto = new PageResponseDto<>();
            pageResponseDto.setData(responsePage);
            pageResponseDto.setPage(page);
            pageResponseDto.setLimit(limit);
            pageResponseDto.setSkip(skip);
            pageResponseDto.setTotals(totalRegions);

            // Return success response
            return ResponseEntity
                    .status(HttpStatus.OK)
                    .body(new ApiSuccessResponse<>(
                            HttpStatus.OK.value(),
                            "Get all regions successfully",
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
