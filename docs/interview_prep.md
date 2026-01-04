# Interview Preparation Guide: Job Portal Project

## 1. Resume Bullet Points
Add these to your "Projects" section:

**Job Portal Management System** | *React, Spring Boot, MySQL, JWT*
*   Architected a full-stack recruitment platform using **Spring Boot (Java 17)** and **React.js**, enabling seamless job posting and application management.
*   Designed a secure **REST API** with **JWT-based authentication** (Login, Signup) and Role-Based Access Control (RBAC) for `Recruiters` and `Candidates`.
*   Modeled a relational **MySQL** database with complex entity relationships (One-to-Many, Many-to-Many) using **JPA/Hibernate** for efficient data persistence.
*   Implemented a responsive frontend with **Axios** interceptors for secure token handling and dynamic state management using **Context API**.
*   Developed comprehensive CRUD features for Jobs and Applications, including status tracking and search filtering functionality.

## 2. Project Architecture Explanation (2 Minutes)
"I built a Job Portal application designed to connect Job Seekers and Recruiters. 
The **Frontend** is built with **React** and uses **Vite** for fast building. I structured it with a service layer pattern, distinguishing between UI components and API calls. I used **Context API** for global state management, specifically for handling User Authentication sessions.
The **Backend** is a **Spring Boot** application following a layered architecture: 
- **Controller Layer** for handling HTTP requests.
- **Service Layer** for business logic.
- **Repository Layer** for database interactions using **Spring Data JPA**.
For **Security**, I implemented a custom **JWT (JSON Web Token)** filter chain. Requests are intercepted, validated, and the user's security context is set, allowing for role-based authorization (e.g., only Recruiters can post jobs).
The data is stored in a **MySQL** database, where I designed the schema to link Users, Roles, Jobs, and Applications efficiently."

## 3. Common Interview Questions & Answers

**Q: How did you handle Authentication?**
*A: I used Spring Security with JWT. When a user logs in, I generate a token signed with a secret key. This token is sent to the client and stored partially. For every subsequent request, an Axios interceptor attaches this token to the Authorization header. A custom Filter on the backend validates the token and sets the SecurityContext.*

**Q: Why DTOs (Data Transfer Objects)?**
*A: To decouple the internal database entities from the external API representation. This prevents over-fetching data (like passwords) and allows me to format response data specific to the client's needs.*

**Q: How do you handle many-to-many relationships (e.g., User Roles)?**
*A: I used JPA's `@ManyToMany` annotation with a `@JoinTable` to create a separate mapping table `user_roles`. This allows a user to have multiple roles and a role to be assigned to multiple users without data duplication.*

**Q: What was the hardest part?**
*A: (Sample Answer) configuring the customized Security Filter Chain to allow public access to GET requests for jobs while protecting POST/PUT requests for Recruiters. I had to carefully configure the `requestMatchers` in the `SecurityConfig`.*

**Q: How would you scale this?**
*A: I would implement pagination for the Job search API using Spring Data's `Pageable` interface. I would also add Redis Caching for frequently accessed data like Job Listings to reduce database load.*
