package com.jobportal.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.jobportal.service.JobService;
import com.jobportal.exception.ResourceNotFoundException;

import com.jobportal.dto.JobDto;
import com.jobportal.entity.Company;
import com.jobportal.entity.Job;
import com.jobportal.entity.User;
import com.jobportal.repository.CompanyRepository;
import com.jobportal.repository.JobRepository;

@Service
public class JobServiceImpl implements JobService {

    private JobRepository jobRepository;
    private CompanyRepository companyRepository;
    private com.jobportal.mapper.JobMapper jobMapper;

    public JobServiceImpl(JobRepository jobRepository, CompanyRepository companyRepository,
            com.jobportal.mapper.JobMapper jobMapper) {
        this.jobRepository = jobRepository;
        this.companyRepository = companyRepository;
        this.jobMapper = jobMapper;
    }

    @Override
    public List<JobDto> getAllJobs() {
        return jobRepository.findAll().stream().map(jobMapper::toDto).collect(Collectors.toList());
    }

    @Override
    public List<JobDto> searchJobs(String query) {
        return jobRepository.findByTitleContainingOrCompanyNameContaining(query, query)
                .stream().map(jobMapper::toDto).collect(Collectors.toList());
    }

    @Override
    public JobDto getJobById(@org.springframework.lang.NonNull Long id) {
        Job job = jobRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Job not found"));
        return jobMapper.toDto(job);
    }

    @Override
    public JobDto createJob(JobDto jobDto, User recruiter) {
        Job job = new Job();
        job.setTitle(jobDto.getTitle());
        job.setDescription(jobDto.getDescription());
        job.setRequirements(jobDto.getRequirements());
        job.setLocation(jobDto.getLocation());
        job.setSalaryRange(jobDto.getSalaryRange());
        job.setJobType(jobDto.getJobType());
        job.setRecruiter(recruiter);

        // Simple Company logic: find by name or create
        if (jobDto.getCompanyName() != null) {
            Company company = new Company();
            company.setName(jobDto.getCompanyName());
            company.setRecruiter(recruiter);
            companyRepository.save(company);
            job.setCompany(company);
        }

        Job savedJob = jobRepository.save(job);
        return jobMapper.toDto(savedJob);
    }

    @Override
    public JobDto updateJob(@org.springframework.lang.NonNull Long id, JobDto jobDto, User recruiter) {
        Job job = jobRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Job not found"));

        if (!job.getRecruiter().getId().equals(recruiter.getId())) {
            throw new RuntimeException("Unauthorized");
        }

        job.setTitle(jobDto.getTitle());
        job.setDescription(jobDto.getDescription());
        job.setRequirements(jobDto.getRequirements());
        job.setLocation(jobDto.getLocation());
        job.setSalaryRange(jobDto.getSalaryRange());
        job.setJobType(jobDto.getJobType());

        Job updatedJob = jobRepository.save(job);
        return jobMapper.toDto(updatedJob);
    }

    @Override
    public void deleteJob(@org.springframework.lang.NonNull Long id, User recruiter) {
        Job job = jobRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Job not found"));
        if (!job.getRecruiter().getId().equals(recruiter.getId())) {
            throw new RuntimeException("Unauthorized");
        }
        jobRepository.delete(job);
    }

}
