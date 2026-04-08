package com.url.shorter.security.jwt;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class jwtAuthenticationResponse {
    private String token;
}
