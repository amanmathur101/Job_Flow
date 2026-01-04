package com.jobportal.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.jobportal.model.Company;
import com.jobportal.model.User;

@Repository
public interface CompanyRepository extends JpaRepository<Company, Long> {
    List<Company> findByRecruiter(User recruiter);
}
