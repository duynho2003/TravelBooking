package com.example.city_tours.service;

import com.example.city_tours.config.JwtTokenProvider;
import com.example.city_tours.dto.request.Auth.LoginRequestDto;
import com.example.city_tours.dto.request.Auth.RegisterRequestDto;
import com.example.city_tours.dto.response.Auth.LoginResponseDto;
import com.example.city_tours.dto.response.Auth.RegisterResponseDto;
import com.example.city_tours.entity.Role;
import com.example.city_tours.entity.User;
import com.example.city_tours.enums.UserStatus;
import com.example.city_tours.exception.EmailAlreadyExistsException;
import com.example.city_tours.exception.InvalidUsernameOrPasswordException;
import com.example.city_tours.exception.UsernameAlreadyExistsException;
import com.example.city_tours.repository.BlacklistTokenRepository;
import com.example.city_tours.repository.RoleRepository;
import com.example.city_tours.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class AuthServiceImpl implements AuthService{

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    private final AuthenticationManager authenticationManager;

    private final JwtTokenProvider jwtTokenProvider;

    private final RoleRepository roleRepository;
    private final BlacklistTokenRepository blacklistTokenRepository;

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
        user.setStatus(UserStatus.ACTIVE);

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

        return responseDto;
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
