package com.jobportal.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Value("${app.cors.allowedOrigins}")
    private String[] allowedOrigins = new String[] {};

    @Override
    public void addCorsMappings(@org.springframework.lang.NonNull CorsRegistry registry) {
        // Hardcoded generic CORS policy to fix "Network Error" unconditionally
        registry.addMapping("/**")
                .allowedOriginPatterns("*") // Allow ANY origin (Vercel, localhost, etc.)
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);
    }
}
