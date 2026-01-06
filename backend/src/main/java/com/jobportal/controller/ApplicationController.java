package com.jobportal.controller;

import java.security.Principal;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.jobportal.dto.ApplicationDto;
import com.jobportal.entity.User;
import com.jobportal.repository.UserRepository;
import com.jobportal.service.ApplicationService;

@RestController
@RequestMapping("/api/applications")
public class ApplicationController {

    private ApplicationService applicationService;
    private UserRepository userRepository;

    public ApplicationController(ApplicationService applicationService, UserRepository userRepository) {
        this.applicationService = applicationService;
        this.userRepository = userRepository;
    }

    @PreAuthorize("hasRole('CANDIDATE')")
    @PostMapping("/apply/{jobId}")
    public ResponseEntity<ApplicationDto> applyForJob(@PathVariable @NonNull Long jobId,
            @RequestParam(defaultValue = "resume.pdf") String resumeUrl, Principal principal) {
        User candidate = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(applicationService.applyForJob(jobId, candidate, resumeUrl));
    }

    @PreAuthorize("hasRole('CANDIDATE')")
    @GetMapping("/my-applications")
    public ResponseEntity<List<ApplicationDto>> getMyApplications(Principal principal) {
        User candidate = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(applicationService.getApplicationsForCandidate(candidate));
    }

    @PreAuthorize("hasRole('RECRUITER')")
    @GetMapping("/job/{jobId}")
    public ResponseEntity<List<ApplicationDto>> getJobApplications(@PathVariable @NonNull Long jobId,
            Principal principal) {
        User recruiter = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(applicationService.getApplicationsForJob(jobId, recruiter));
    }

    @PreAuthorize("hasRole('RECRUITER')")
    @PutMapping("/{id}/status")
    public ResponseEntity<ApplicationDto> updateStatus(@PathVariable @NonNull Long id, @RequestParam String status,
            Principal principal) {
        User recruiter = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(applicationService.updateApplicationStatus(id, status, recruiter));
    }
}
