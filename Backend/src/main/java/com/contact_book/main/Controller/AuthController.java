package com.contact_book.main.Controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.contact_book.main.DTO.SignInRequest;
import com.contact_book.main.DTO.SignUpRequest;
import com.contact_book.main.Exception.EmailExistsException;
import com.contact_book.main.Exception.UserNotFoundException;
import com.contact_book.main.Response.AuthResponse;
import com.contact_book.main.Response.ErrorResponse;
import com.contact_book.main.Service.AuthService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@Validated
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/sign-up")
    public ResponseEntity<AuthResponse> signUp(@Valid @RequestBody SignUpRequest user) {
        return ResponseEntity.ok(authService.signUp(user));
    }

    @PostMapping("/sign-in")
    public ResponseEntity<AuthResponse> signIn(@Valid @RequestBody SignInRequest user) {
        return ResponseEntity.ok(authService.signIn(user));
    }

    @ExceptionHandler({ UserNotFoundException.class, BadCredentialsException.class })
    public ResponseEntity<ErrorResponse> handleAuthenticationExceptions(RuntimeException ex) {
        return new ResponseEntity<>(new ErrorResponse(ex.getMessage()), HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(EmailExistsException.class)
    public ResponseEntity<ErrorResponse> handleEmailExistsException(EmailExistsException ex) {
        return new ResponseEntity<>(new ErrorResponse(ex.getMessage()), HttpStatus.BAD_REQUEST);
    }
}
