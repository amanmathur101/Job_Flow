package com.jobportal.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
public class CorsConfig {

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration config = new CorsConfiguration();

        config.setAllowCredentials(true);

        config.addAllowedOrigin("http://localhost:5173");
        config.addAllowedOrigin("https://job-portal-delta-lyart.vercel.app");
        config.addAllowedOrigin("https://job-portal-git-main-aman-kumars-projects-8e4adb13.vercel.app");
        config.addAllowedOrigin("https://job-portal-iwcqolo4q-aman-kumars-projects-8e4adb13.vercel.app");

        config.addAllowedHeader("*");
        config.addAllowedMethod("*"); // ✅ OPTIONS included

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);

        return source;
    }
}
