package com.contact_book.main.Service;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.contact_book.main.DTO.SignInRequest;
import com.contact_book.main.DTO.SignUpRequest;
import com.contact_book.main.Exception.EmailExistsException;
import com.contact_book.main.Exception.UserNotFoundException;
import com.contact_book.main.Model.User;
import com.contact_book.main.Repository.UserRepository;
import com.contact_book.main.Response.AuthResponse;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    private final JwtService jwtService;

    private final AuthenticationManager authenticationManager;

    public AuthResponse signUp(SignUpRequest user) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new EmailExistsException("Email already exists");
        }

        User newUser = new User();

        newUser.setFull_name(user.getFull_name());
        newUser.setEmail(user.getEmail());
        newUser.setPassword(passwordEncoder.encode(user.getPassword()));

        newUser = userRepository.save(newUser);

        String token = jwtService.generateToken(newUser);

        return new AuthResponse(token, newUser.getFull_name(), newUser.getEmail());
    }

    public AuthResponse signIn(SignInRequest user) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(user.getEmail(), user.getPassword()));
        } catch (AuthenticationException e) {
            throw new BadCredentialsException("Invalid credentials");
        }

        User userToLogin = userRepository.findByEmail(user.getEmail())
                .orElseThrow(() -> new UserNotFoundException("Invalid credentials"));

        String token = jwtService.generateToken(userToLogin);
        return new AuthResponse(token, userToLogin.getFull_name(), userToLogin.getEmail());
    }
}
