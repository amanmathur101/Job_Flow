package com.jobportal.mapper;

import org.springframework.stereotype.Component;
import com.jobportal.dto.ApplicationDto;
import com.jobportal.entity.Application;

@Component
public class ApplicationMapper {

    public ApplicationDto toDto(Application app) {
        if (app == null) {
            return null;
        }
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
