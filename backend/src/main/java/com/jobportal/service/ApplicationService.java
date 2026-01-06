package com.jobportal.service;

import java.util.List;

import org.springframework.lang.NonNull;

import com.jobportal.dto.ApplicationDto;
import com.jobportal.entity.User;

public interface ApplicationService {
    ApplicationDto applyForJob(@NonNull Long jobId, User candidate, String resumeUrl);

    List<ApplicationDto> getApplicationsForJob(@NonNull Long jobId, User recruiter);

    List<ApplicationDto> getApplicationsForCandidate(User candidate);

    ApplicationDto updateApplicationStatus(@NonNull Long applicationId, String status, User recruiter);
}
