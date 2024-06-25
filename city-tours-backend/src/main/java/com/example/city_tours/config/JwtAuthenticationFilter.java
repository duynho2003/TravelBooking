package com.example.city_tours.config;

import com.example.city_tours.entity.User;
import com.example.city_tours.enums.UserStatus;
import com.example.city_tours.exception.JwtAuthenticationException;
import com.example.city_tours.exception.UserNotFoundException;
import com.example.city_tours.repository.BlacklistTokenRepository;
import com.example.city_tours.repository.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreInvocationAttribute;
import org.springframework.security.access.prepost.PreInvocationAuthorizationAdviceVoter;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;
import java.util.Collection;
import java.util.List;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private final JwtTokenProvider jwtTokenProvider;

    @Autowired
    private final UserDetailsService userDetailsService;

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private BlacklistTokenRepository blacklistTokenRepository;

    public JwtAuthenticationFilter(JwtTokenProvider jwtTokenProvider, UserDetailsService userDetailsService) {
        this.jwtTokenProvider = jwtTokenProvider;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String token = getTokenFromRequest(request);

        if (StringUtils.hasText(token) && jwtTokenProvider.validateToken(token)) {
            System.out.println("Token found and validated successfully");

            if (jwtTokenProvider.isTokenBlacklisted(token)) {
                System.out.println("JWT token is blacklisted");
                throw new JwtAuthenticationException("JWT token is blacklisted");
            }

            String username = jwtTokenProvider.getUsername(token);
            System.out.println("Username extracted from token: " + username);

            User user = userRepository.findByUsername(username);
            if (user == null) {
                System.out.println("User not found for username: " + username);
                throw new UserNotFoundException("User not found");
            }

            if (jwtTokenProvider.isTokenBlacklisted(token)) {
                System.out.println("JWT token is blacklisted");
                throw new JwtAuthenticationException("JWT token is blacklisted");
            }

            if (!user.getStatus().equals(UserStatus.ACTIVE)) {
                System.out.println("User is inactive");
                throw new JwtAuthenticationException("User is inactive");
            }

            UserDetails userDetails = userDetailsService.loadUserByUsername(username);

            UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
            authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

            SecurityContextHolder.getContext().setAuthentication(authenticationToken);
            System.out.println("User authenticated successfully: " + username);

//            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
//            if (!hasPermission(authentication)) {
//                throw new AccessDeniedException("Bạn không có quyền truy cập tài nguyên này");
//            }
        } else {
            System.out.println("No valid JWT token found in request");
        }
        filterChain.doFilter(request, response);
    }

    public String getTokenFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");

        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }

        return null;
    }

//    private boolean hasPermission(HttpServletRequest request, UserDetails userDetails) {
//        // Get PrePostInvocationAttributes from PrePostInvocationAttributeSource
//        List<PrePostInvocationAttribute> attributes = prePostInvocationAttributeSource.getAttributes(null, null, null);
//
//        // If no attributes found, allow access by default
//        if (CollectionUtils.isEmpty(attributes)) {
//            return true;
//        }
//
//        // Evaluate permissions using PrePostInvocationPrivilegeEvaluator
//        PrePostInvocationAttributes prePostAttributes = new PrePostInvocationAttributes(attributes);
//        return prePostInvocationPrivilegeEvaluator.hasPermission(SecurityContextHolder.getContext().getAuthentication(), null, prePostAttributes);
//    }

}
