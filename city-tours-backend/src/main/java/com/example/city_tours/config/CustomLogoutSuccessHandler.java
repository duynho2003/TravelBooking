package com.example.city_tours.config;

import com.example.city_tours.common.ApiSuccessResponse;
import com.example.city_tours.entity.BlacklistToken;
import com.example.city_tours.repository.BlacklistTokenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.logout.LogoutSuccessHandler;
import org.springframework.stereotype.Component;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.time.LocalDateTime;

@Component
public class CustomLogoutSuccessHandler implements LogoutSuccessHandler {
    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private BlacklistTokenRepository blacklistTokenRepository;

    @Override
    public void onLogoutSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException {
        String token = jwtTokenProvider.getTokenFromHttpServletRequest(request);

        if (token != null) {
            BlacklistToken blacklistToken = new BlacklistToken();
            blacklistToken.setToken(token);
            blacklistToken.setCreatedAt(LocalDateTime.now());
            blacklistTokenRepository.save(blacklistToken);
        }

        // Build the API response
        ApiSuccessResponse<?> apiResponse = new ApiSuccessResponse<>(
                HttpStatus.OK.value(),
                "User logged out successfully",
                null
        );

        response.setStatus(HttpStatus.OK.value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);

        PrintWriter writer = response.getWriter();
        writer.println("{");
        writer.println("  \"status\": " + apiResponse.getStatus() + ",");
        writer.println("  \"message\": \"" + apiResponse.getMessage() + "\",");
        writer.println("}");
        writer.flush();
    }
}
