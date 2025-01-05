package com.profile.profile.features.authentication.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class AuthenticationRequestBody {
    @NotBlank(message = "Email is mandatory")
    private String email;
    @NotBlank(message = "Password is Mandatory")
    private String password;

    public AuthenticationRequestBody(String email, String password) {
        this.email = email;
        this.password = password;
    }

    public AuthenticationRequestBody() {}

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
