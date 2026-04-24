package com.smartcampus.dto;

import lombok.Data;

@Data
public class GoogleAuthRequest {
    private String credential; // The JWT token returned by Google
}
