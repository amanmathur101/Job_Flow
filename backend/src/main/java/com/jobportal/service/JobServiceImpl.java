package com.jobportal.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.jobportal.dto.JobDto;
import com.jobportal.model.Company;
import com.jobportal.model.Job;
import com.jobportal.model.User;
import com.jobportal.repository.CompanyRepository;
import com.jobportal.repository.JobRepository;

@Service
public class JobServiceImpl implements JobService {

    private JobRepository jobRepository;
    private CompanyRepository companyRepository;

    public JobServiceImpl(JobRepository jobRepository, CompanyRepository companyRepository) {
        this.jobRepository = jobRepository;
        this.companyRepository = companyRepository;
    }

    @Override
    public List<JobDto> getAllJobs() {
        return jobRepository.findAll().stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Override
    public List<JobDto> searchJobs(String query) {
        return jobRepository.findByTitleContainingOrCompanyNameContaining(query, query)
                .stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Override
    public JobDto getJobById(@org.springframework.lang.NonNull Long id) {
        Job job = jobRepository.findById(id).orElseThrow(() -> new RuntimeException("Job not found"));
        return mapToDto(job);
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
        return mapToDto(savedJob);
    }

    @Override
    public JobDto updateJob(@org.springframework.lang.NonNull Long id, JobDto jobDto, User recruiter) {
        Job job = jobRepository.findById(id).orElseThrow(() -> new RuntimeException("Job not found"));

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
        return mapToDto(updatedJob);
    }

    @Override
    public void deleteJob(@org.springframework.lang.NonNull Long id, User recruiter) {
        Job job = jobRepository.findById(id).orElseThrow(() -> new RuntimeException("Job not found"));
        if (!job.getRecruiter().getId().equals(recruiter.getId())) {
            throw new RuntimeException("Unauthorized");
        }
        jobRepository.delete(job);
    }

    private JobDto mapToDto(Job job) {
        JobDto dto = new JobDto();
        dto.setId(job.getId());
        dto.setTitle(job.getTitle());
        dto.setDescription(job.getDescription());
        dto.setRequirements(job.getRequirements());
        dto.setLocation(job.getLocation());
        dto.setSalaryRange(job.getSalaryRange());
        dto.setJobType(job.getJobType());
        dto.setPostedAt(job.getPostedAt());
        dto.setRecruiterId(job.getRecruiter().getId());
        if (job.getCompany() != null) {
            dto.setCompanyId(job.getCompany().getId());
            dto.setCompanyName(job.getCompany().getName());
        }
        return dto;
    }
}
