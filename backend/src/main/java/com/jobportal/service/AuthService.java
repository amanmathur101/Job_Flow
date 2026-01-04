package com.jobportal.service;

import com.jobportal.dto.LoginDto;
import com.jobportal.dto.SignUpDto;

public interface AuthService {
    String login(LoginDto loginDto);

    String register(SignUpDto signUpDto);
}
