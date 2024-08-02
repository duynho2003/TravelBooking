package com.example.city_tours.service;

import com.example.city_tours.config.JwtTokenProvider;
import com.example.city_tours.dto.request.Auth.LoginRequestDto;
import com.example.city_tours.dto.request.Auth.RegisterRequestDto;
import com.example.city_tours.dto.request.Auth.UpdatePasswordRequestDto;
import com.example.city_tours.dto.response.Auth.LoginResponseDto;
import com.example.city_tours.dto.response.Auth.RegisterResponseDto;
import com.example.city_tours.entity.*;
import com.example.city_tours.enums.UserStatus;
import com.example.city_tours.exception.*;
import com.example.city_tours.repository.ConfirmationTokenRepository;
import com.example.city_tours.repository.PasswordResetTokenRepository;
import com.example.city_tours.repository.RoleRepository;
import com.example.city_tours.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class AuthServiceImpl implements AuthService{

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final RoleRepository roleRepository;
    private final ConfirmationTokenRepository confirmationTokenRepository;
    private final EmailService emailService;
    private final PasswordResetTokenRepository passwordResetTokenRepository;

    @Override
    public RegisterResponseDto register(RegisterRequestDto registerRequestDto) {

        if (userRepository.existsByUsername(registerRequestDto.getUsername())) {
            throw new UsernameAlreadyExistsException("Username is already taken");
        }

        if (userRepository.existsByEmail(registerRequestDto.getEmail())) {
            throw new EmailAlreadyExistsException("Email is already registered");
        }

        User user = new User();

        user.setUsername(registerRequestDto.getUsername());
        user.setEmail(registerRequestDto.getEmail());
        user.setPassword(passwordEncoder.encode(registerRequestDto.getPassword()));
        user.setStatus(UserStatus.IN_ACTIVE);
        user.setCreatedAt(LocalDateTime.now());

        Set<Role> roles = new HashSet<>();

        for (String roleName : registerRequestDto.getRoles()) {
            Role role = roleRepository.findByName(roleName);

            if (role == null) {
                role = new Role();
                role.setName(roleName);
                roleRepository.save(role);
            }

            roles.add(role);
        }

        user.setRoles(roles);

        userRepository.save(user);

        RegisterResponseDto responseDto = new RegisterResponseDto();

        responseDto.setId(user.getId());
        responseDto.setUsername(user.getUsername());
        responseDto.setEmail(user.getEmail());
        responseDto.setRoles(user.getRoles().stream().map(Role::getName).collect(Collectors.toSet()));
        responseDto.setCreatedAt(user.getCreatedAt());

        ConfirmationToken confirmationToken = new ConfirmationToken(user);
        confirmationTokenRepository.save(confirmationToken);

        // Trả về responseDto trước khi gửi email
        CompletableFuture.runAsync(() -> {
            emailService.sendConfirmationEmail(user.getEmail(), confirmationToken.getToken());
        });

        return responseDto;
    }

    @Override
    public String confirmAccount(String token) {
        ConfirmationToken confirmationToken = confirmationTokenRepository.findByToken(token)
                .orElseThrow(() -> new IllegalArgumentException("Invalid confirmation token"));

        if (confirmationToken.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new TokenExpiredException("Token đã hết hạn");
        }

        User user = confirmationToken.getUser();
        user.setStatus(UserStatus.ACTIVE);
        userRepository.save(user);

        String successMessage = "Tài khoản của bạn đã được kích hoạt thành công!";

        deleteConfirmationToken(confirmationToken);

        return successMessage;
    }

    public void sendPasswordResetEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        // Generate token
        PasswordResetToken resetToken = new PasswordResetToken(user);
        passwordResetTokenRepository.save(resetToken);

        // Send email
        String resetUrl = "http://localhost:4200/reset-password/" + resetToken.getToken();
        emailService.sendPasswordResetEmail(user.getEmail(), resetUrl);
    }

    @Override
    public void updatePassword(UpdatePasswordRequestDto requestDto) {
        // Xác thực token
        PasswordResetToken resetToken = passwordResetTokenRepository.findByToken(requestDto.getToken())
                .orElseThrow(() -> new TokenExpiredException("Invalid or expired token"));

        // Kiểm tra token có hết hạn không
        if (resetToken.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new TokenExpiredException("Token has expired");
        }

        // Lấy người dùng liên kết với token
        User user = resetToken.getUser();

        // Cập nhật mật khẩu mới
        user.setPassword(passwordEncoder.encode(requestDto.getNewPassword()));
        userRepository.save(user);

        // Xóa token hoặc đánh dấu nó là đã sử dụng
        passwordResetTokenRepository.delete(resetToken);
    }


    // Phương thức để xóa token xác nhận
    private void deleteConfirmationToken(ConfirmationToken token) {
        confirmationTokenRepository.delete(token);
    }

    @Override
    public LoginResponseDto login(LoginRequestDto loginRequestDto) {
        String username = loginRequestDto.getUsername();
        String password = loginRequestDto.getPassword();

        User user = userRepository.findByUsername(username);

        if (user == null) {
            throw new InvalidUsernameOrPasswordException("Invalid username or password");
        }

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new InvalidUsernameOrPasswordException("Invalid username or password");
        }

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequestDto.getUsername(), loginRequestDto.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        String token = jwtTokenProvider.generateToken(authentication);

        LoginResponseDto loginResponseDto = new LoginResponseDto();

        loginResponseDto.setToken(token);

        return loginResponseDto;
    }

}
