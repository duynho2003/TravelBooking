package com.example.city_tours.controller;

import com.example.city_tours.common.ApiErrorResponse;
import com.example.city_tours.common.ApiSuccessResponse;
import com.example.city_tours.common.ErrorCode;
import com.example.city_tours.dto.request.Website.CreateInfoRequestDto;
import com.example.city_tours.dto.request.Website.UpdateInfoRequestDto;
import com.example.city_tours.dto.response.Website.CreateInfoResponseDto;
import com.example.city_tours.dto.response.Website.GetInfoResponseDto;
import com.example.city_tours.dto.response.Website.UpdateInfoResponseDto;
import com.example.city_tours.exception.*;
import com.example.city_tours.service.WebsiteService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@AllArgsConstructor
@RestController
@RequestMapping("/api/v1/websites")
public class WebsiteController {

    private WebsiteService websiteService;

    @GetMapping("/{websiteInfoId}")
    public ResponseEntity<?> getInfo(@PathVariable Long websiteInfoId) {
        try {
            GetInfoResponseDto responseDto = websiteService.getInfo(websiteInfoId);
            return ResponseEntity
                    .status(HttpStatus.OK)
                    .body(new ApiSuccessResponse<>(
                            HttpStatus.OK.value(),
                            "Get website info successfully",
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

    @PostMapping("/create")
    public ResponseEntity<?> createInfo(
            @RequestParam String name,
            @RequestPart MultipartFile logo,
            @RequestParam String email,
            @RequestParam String phone,
            @RequestParam String address,
            @RequestParam String workingDate,
            @RequestParam String workingTime
            ) {
        try {
            CreateInfoRequestDto createInfoRequestDto = new CreateInfoRequestDto();

            createInfoRequestDto.setName(name);
            createInfoRequestDto.setLogo(logo);
            createInfoRequestDto.setEmail(email);
            createInfoRequestDto.setPhone(phone);
            createInfoRequestDto.setAddress(address);
            createInfoRequestDto.setWorkingDate(workingDate);
            createInfoRequestDto.setWorkingTime(workingTime);

            CreateInfoResponseDto responseDto = websiteService.createInfo(createInfoRequestDto);
            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(new ApiSuccessResponse<>(
                            HttpStatus.CREATED.value(),
                            "Website info created successfully",
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

    @PutMapping("/{websiteInfoId}")
    public ResponseEntity<?> updateInfo(
            @PathVariable Long websiteInfoId,
            @RequestParam String name,
            @RequestPart MultipartFile logo,
            @RequestParam String email,
            @RequestParam String phone,
            @RequestParam String address,
            @RequestParam String workingDate,
            @RequestParam String workingTime
    ) {
        try {
            UpdateInfoRequestDto websiteUpdateInfoRequestDto = new UpdateInfoRequestDto();

            websiteUpdateInfoRequestDto.setName(name);
            websiteUpdateInfoRequestDto.setLogo(logo);
            websiteUpdateInfoRequestDto.setEmail(email);
            websiteUpdateInfoRequestDto.setPhone(phone);
            websiteUpdateInfoRequestDto.setAddress(address);
            websiteUpdateInfoRequestDto.setWorkingDate(workingDate);
            websiteUpdateInfoRequestDto.setWorkingTime(workingTime);

            UpdateInfoResponseDto responseDto = websiteService.updateInfo(websiteInfoId, websiteUpdateInfoRequestDto);
            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(new ApiSuccessResponse<>(
                            HttpStatus.CREATED.value(),
                            "Website info updated successfully",
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
