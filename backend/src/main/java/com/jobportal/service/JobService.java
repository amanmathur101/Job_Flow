package com.jobportal.service;

import java.util.List;

import com.jobportal.dto.JobDto;
import com.jobportal.entity.User;

public interface JobService {
    List<JobDto> getAllJobs();

    List<JobDto> searchJobs(String query);

    JobDto getJobById(@org.springframework.lang.NonNull Long id);

    JobDto createJob(JobDto jobDto, User recruiter);

    JobDto updateJob(@org.springframework.lang.NonNull Long id, JobDto jobDto, User recruiter);

    void deleteJob(@org.springframework.lang.NonNull Long id, User recruiter);
}
