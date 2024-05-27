package com.contact_book.main.Response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private String fullName;
    private String email;

    // public AuthResponse(String token) {
    // this.token = token;
    // }

    // public String getToken() {
    // return token;
    // }
}
