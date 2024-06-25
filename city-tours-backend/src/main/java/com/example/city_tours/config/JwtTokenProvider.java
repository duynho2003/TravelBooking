package com.example.city_tours.config;

import com.example.city_tours.entity.BlacklistToken;
import com.example.city_tours.entity.User;
import com.example.city_tours.repository.BlacklistTokenRepository;
import com.example.city_tours.repository.UserRepository;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import javax.crypto.SecretKey;
import java.security.Key;
import java.util.Collection;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class JwtTokenProvider {
    @Value("${app.jwt-secret}")
    private String jwtSecret;

    @Value("${app.jwt-expiration-milliseconds}")
    private long jwtExpirationDate;
    private final UserRepository userRepository;
    private final BlacklistTokenRepository blacklistTokenRepository;

    public JwtTokenProvider(UserRepository userRepository,
                            BlacklistTokenRepository blacklistTokenRepository) {
        this.userRepository = userRepository;
        this.blacklistTokenRepository = blacklistTokenRepository;
    }

    public String generateToken(Authentication authentication) {
        String username = authentication.getName();
        Date currentDate =  new Date();
        Date exprireDate = new Date(currentDate.getTime() + jwtExpirationDate);

        User user = userRepository.findByUsername(username);
        Long id = user.getId();
        String email = user.getEmail();
        String status = user.getStatus().toString();
        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
        List<String> authoritiesList = authorities.stream().map(GrantedAuthority::getAuthority).collect(Collectors.toList());

        return Jwts.builder()
                .subject(username)
                .claim("id", id)
                .claim("email", email)
                .claim("status", status)
                .claim("authorities", authoritiesList)
                .issuedAt(new Date())
                .expiration(exprireDate)
                .signWith(key())
                .compact();
    }

    private Key key(){
        return Keys.hmacShaKeyFor(Decoders.BASE64.decode(jwtSecret));
    }

    public String getId(String token) {
        return Jwts.parser()
                .verifyWith((SecretKey) key())
                .build()
                .parseSignedClaims(token)
                .getPayload().getId();
    }

    public String getUsername(String token) {
        return Jwts.parser()
                .verifyWith((SecretKey) key())
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();
    }

    public boolean validateToken(String token) {
        Jwts.parser()
                .verifyWith((SecretKey) key())
                .build()
                .parse(token);

        return true;
    }

    public boolean isTokenBlacklisted(String token) {
        BlacklistToken blacklistToken = blacklistTokenRepository.findByToken(token);

        System.out.println("blacklistToken: " + blacklistToken);

        return blacklistToken != null;
    }

    public String getTokenFromHttpServletRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}