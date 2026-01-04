# Job Portal Backend Architecture & Database Design

## 1. Backend Architecture (Spring Boot)

### Layers
1.  **Controller Layer** (`com.jobportal.controller`): Handles HTTP requests, validation, and maps to DTOs.
2.  **Service Layer** (`com.jobportal.service`): Contains business logic, transaction management.
3.  **Repository Layer** (`com.jobportal.repository`): Interfaces with the database using Spring Data JPA.
4.  **Security Layer** (`com.jobportal.security`): Handles JWT authentication and role-based authorization.
5.  **Exception Layer** (`com.jobportal.exception`): Global exception handling (`@ControllerAdvice`).

### Package Structure
```
com.jobportal
├── config          # SecurityConfig, CorsConfig, SwaggerConfig
├── controller      # AuthController, JobController, ApplicationController
├── dto             # LoginRequest, SignupRequest, JobDTO, ApplicationDTO
├── exception       # GlobalExceptionHandler, ResourceNotFoundException
├── model           # User, Role, Job, Application, Company
├── repository      # UserRepository, JobRepository, ApplicationRepository
├── security        # JwtTokenProvider, JwtAuthenticationFilter, UserDetailsServiceImpl
└── service         # AuthService, JobService, ApplicationService
```

### Security Flow (JWT)
1.  **Login**: User sends `email/password` -> `AuthController` -> `AuthenticationManager` -> return `JWT Token`.
2.  **Request**: Client sends `Authorization: Bearer <token>`.
3.  **Filter**: `JwtAuthenticationFilter` intercepts -> Validates Token -> Sets `SecurityContext`.
4.  **Access**: `SecurityConfig` checks `hasRole('ADMIN')` or `hasRole('RECRUITER')`.

---

## 2. Database Design (MySQL)

### ER Diagram Description
- **Users**: Central entity. Roles distinguish Admin, Recruiter, Candidate.
- **Companies**: Recruiters belong to companies (Optional: simple string in Job or dedicated table. Design decision: **Dedicated Table** for scalability).
- **Jobs**: Posted by Recruiters (linked to User/Company).
- **Applications**: Link between User (Candidate) and Job.
- **Resumes**: Linked to User or Application (URL/Path).

### Schema (SQL)

```sql
-- Role Table (or Enum in User, but Table is more flexible)
CREATE TABLE roles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE -- ROLE_ADMIN, ROLE_RECRUITER, ROLE_CANDIDATE
);

-- Users Table
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User_Roles (Many-to-Many)
CREATE TABLE user_roles (
    user_id BIGINT NOT NULL,
    role_id BIGINT NOT NULL,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (role_id) REFERENCES roles(id)
);

-- Companies (Optional, but good for Recruiter profile)
CREATE TABLE companies (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    website VARCHAR(255),
    description TEXT,
    recruiter_id BIGINT, -- Owner
    FOREIGN KEY (recruiter_id) REFERENCES users(id)
);

-- Jobs
CREATE TABLE jobs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    requirements TEXT,
    location VARCHAR(100),
    salary_range VARCHAR(50),
    job_type VARCHAR(50), -- FULL_TIME, PART_TIME
    posted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    company_id BIGINT, -- Linked to Company
    recruiter_id BIGINT NOT NULL, -- Posted by
    FOREIGN KEY (company_id) REFERENCES companies(id),
    FOREIGN KEY (recruiter_id) REFERENCES users(id)
);

-- Applications
CREATE TABLE applications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    job_id BIGINT NOT NULL,
    candidate_id BIGINT NOT NULL,
    resume_url VARCHAR(255),
    status VARCHAR(50) DEFAULT 'PENDING', -- PENDING, SHORTLISTED, REJECTED, ACCEPTED
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (job_id) REFERENCES jobs(id),
    FOREIGN KEY (candidate_id) REFERENCES users(id),
    UNIQUE (job_id, candidate_id) -- Prevent duplicate applications
);
```

## 3. API Endpoints

### Auth
- `POST /api/auth/signup`
- `POST /api/auth/login`

### Jobs
- `GET /api/jobs` (Public/Filtered)
- `GET /api/jobs/{id}` (Public)
- `POST /api/jobs` (Recruiter)
- `PUT /api/jobs/{id}` (Recruiter)
- `DELETE /api/jobs/{id}` (Recruiter)

### Applications
- `POST /api/applications/apply/{jobId}` (Candidate)
- `GET /api/applications/my-applications` (Candidate)
- `GET /api/applications/job/{jobId}` (Recruiter)
- `PUT /api/applications/{id}/status` (Recruiter)

