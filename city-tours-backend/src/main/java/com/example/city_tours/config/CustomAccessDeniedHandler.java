package com.example.city_tours.config;

import com.example.city_tours.common.ApiErrorResponse;
import com.example.city_tours.common.ErrorCode;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;
import java.io.IOException;

@Component
public class CustomAccessDeniedHandler implements AccessDeniedHandler {

    @Override
    public void handle(HttpServletRequest request, HttpServletResponse response,
                       AccessDeniedException accessDeniedException) throws IOException, ServletException {

        response.setStatus(HttpServletResponse.SC_FORBIDDEN);

        ApiErrorResponse apiErrorResponse = new ApiErrorResponse(
                HttpStatus.FORBIDDEN.value(),
                accessDeniedException.getMessage(),
                ErrorCode.FORBIDDEN,
                "http://localhost:5050/docs/errors/1014"
        );

        response.getWriter().write(apiErrorResponse.toString());
        response.setContentType("application/json");
    }
}

