package com.jobportal.mapper;

import org.springframework.stereotype.Component;
import com.jobportal.dto.JobDto;
import com.jobportal.entity.Job;

@Component
public class JobMapper {

    public JobDto toDto(Job job) {
        if (job == null) {
            return null;
        }
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

    // We can add toEntity if needed, but for now services do manual entity creation
    // because of logic like "Find Company or Create".
}
