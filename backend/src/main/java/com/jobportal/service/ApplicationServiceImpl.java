package com.jobportal.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.jobportal.dto.ApplicationDto;
import com.jobportal.model.Application;
import com.jobportal.model.Job;
import com.jobportal.model.User;
import com.jobportal.repository.ApplicationRepository;
import com.jobportal.repository.JobRepository;

@Service
public class ApplicationServiceImpl implements ApplicationService {

    private ApplicationRepository applicationRepository;
    private JobRepository jobRepository;

    public ApplicationServiceImpl(ApplicationRepository applicationRepository, JobRepository jobRepository) {
        this.applicationRepository = applicationRepository;
        this.jobRepository = jobRepository;
    }

    @Override
    public ApplicationDto applyForJob(@org.springframework.lang.NonNull Long jobId, User candidate, String resumeUrl) {
        Job job = jobRepository.findById(jobId).orElseThrow(() -> new RuntimeException("Job not found"));

        if (applicationRepository.existsByJobAndCandidate(job, candidate)) {
            throw new RuntimeException("Already applied");
        }

        Application application = new Application();
        application.setJob(job);
        application.setCandidate(candidate);
        application.setResumeUrl(resumeUrl);
        application.setStatus("PENDING");

        Application savedApp = applicationRepository.save(application);
        return mapToDto(savedApp);
    }

    @Override
    public List<ApplicationDto> getApplicationsForJob(@org.springframework.lang.NonNull Long jobId, User recruiter) {
        Job job = jobRepository.findById(jobId).orElseThrow(() -> new RuntimeException("Job not found"));

        if (!job.getRecruiter().getId().equals(recruiter.getId())) {
            throw new RuntimeException("Unauthorized");
        }

        return applicationRepository.findByJob(job).stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Override
    public List<ApplicationDto> getApplicationsForCandidate(User candidate) {
        return applicationRepository.findByCandidate(candidate).stream().map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public ApplicationDto updateApplicationStatus(@org.springframework.lang.NonNull Long applicationId, String status,
            User recruiter) {
        Application app = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        if (!app.getJob().getRecruiter().getId().equals(recruiter.getId())) {
            throw new RuntimeException("Unauthorized");
        }

        app.setStatus(status);
        Application updatedApp = applicationRepository.save(app);
        return mapToDto(updatedApp);
    }

    private ApplicationDto mapToDto(Application app) {
        ApplicationDto dto = new ApplicationDto();
        dto.setId(app.getId());
        dto.setJobId(app.getJob().getId());
        dto.setJobTitle(app.getJob().getTitle());
        dto.setCompanyName(app.getJob().getCompany() != null ? app.getJob().getCompany().getName() : "");
        dto.setCandidateId(app.getCandidate().getId());
        dto.setCandidateName(app.getCandidate().getName());
        dto.setCandidateEmail(app.getCandidate().getEmail());
        dto.setResumeUrl(app.getResumeUrl());
        dto.setStatus(app.getStatus());
        dto.setAppliedAt(app.getAppliedAt());
        return dto;
    }
}
