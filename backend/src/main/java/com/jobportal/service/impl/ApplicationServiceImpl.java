package com.jobportal.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.jobportal.service.ApplicationService;
import com.jobportal.exception.ResourceNotFoundException;

import com.jobportal.dto.ApplicationDto;
import com.jobportal.entity.Application;
import com.jobportal.entity.Job;
import com.jobportal.entity.User;
import com.jobportal.repository.ApplicationRepository;
import com.jobportal.repository.JobRepository;

@Service
public class ApplicationServiceImpl implements ApplicationService {

    private ApplicationRepository applicationRepository;
    private JobRepository jobRepository;
    private com.jobportal.mapper.ApplicationMapper applicationMapper;

    public ApplicationServiceImpl(ApplicationRepository applicationRepository, JobRepository jobRepository,
            com.jobportal.mapper.ApplicationMapper applicationMapper) {
        this.applicationRepository = applicationRepository;
        this.jobRepository = jobRepository;
        this.applicationMapper = applicationMapper;
    }

    @Override
    public ApplicationDto applyForJob(@org.springframework.lang.NonNull Long jobId, User candidate, String resumeUrl) {
        Job job = jobRepository.findById(jobId).orElseThrow(() -> new ResourceNotFoundException("Job not found"));

        if (applicationRepository.existsByJobAndCandidate(job, candidate)) {
            throw new RuntimeException("Already applied");
        }

        Application application = new Application();
        application.setJob(job);
        application.setCandidate(candidate);
        application.setResumeUrl(resumeUrl);
        application.setStatus("PENDING");

        Application savedApp = applicationRepository.save(application);
        return applicationMapper.toDto(savedApp);
    }

    @Override
    public List<ApplicationDto> getApplicationsForJob(@org.springframework.lang.NonNull Long jobId, User recruiter) {
        Job job = jobRepository.findById(jobId).orElseThrow(() -> new ResourceNotFoundException("Job not found"));

        if (!job.getRecruiter().getId().equals(recruiter.getId())) {
            throw new RuntimeException("Unauthorized");
        }

        return applicationRepository.findByJob(job).stream().map(applicationMapper::toDto).collect(Collectors.toList());
    }

    @Override
    public List<ApplicationDto> getApplicationsForCandidate(User candidate) {
        return applicationRepository.findByCandidate(candidate).stream().map(applicationMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public ApplicationDto updateApplicationStatus(@org.springframework.lang.NonNull Long applicationId, String status,
            User recruiter) {
        Application app = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found"));

        if (!app.getJob().getRecruiter().getId().equals(recruiter.getId())) {
            throw new RuntimeException("Unauthorized");
        }

        app.setStatus(status);
        Application updatedApp = applicationRepository.save(app);
        return applicationMapper.toDto(updatedApp);
    }

}
