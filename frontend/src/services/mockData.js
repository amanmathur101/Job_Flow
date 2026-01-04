import { UserRole, JobType, ApplicationStatus } from '../types';

export const MOCK_USERS = [
  {
    id: 'u1',
    name: 'Sarah Recruiter',
    email: 'recruiter@jobflow.com',
    role: UserRole.RECRUITER,
    avatarUrl: 'https://picsum.photos/200/200'
  },
  {
    id: 'u2',
    name: 'John Developer',
    email: 'dev@jobflow.com',
    role: UserRole.CANDIDATE,
    title: 'Frontend Engineer',
    avatarUrl: 'https://picsum.photos/201/201'
  }
];

export const MOCK_JOBS = [
  {
    id: 'j1',
    recruiterId: 'u1',
    title: 'Senior React Engineer',
    company: 'TechFlow Solutions',
    location: 'San Francisco, CA',
    type: JobType.FULL_TIME,
    salaryRange: '$140k - $180k',
    description: 'We are looking for a Senior React Engineer to lead our frontend team. You will be responsible for architecture and mentorship.',
    requirements: ['React', 'TypeScript', 'Node.js', 'AWS'],
    postedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString() // 2 days ago
  },
  {
    id: 'j2',
    recruiterId: 'u1',
    title: 'Product Designer',
    company: 'Creative Studios',
    location: 'Remote',
    type: JobType.CONTRACT,
    salaryRange: '$80 - $120 / hr',
    description: 'Join our creative team to design world-class user interfaces.',
    requirements: ['Figma', 'UI/UX', 'Prototyping'],
    postedAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString() // 5 hours ago
  },
  {
    id: 'j3',
    recruiterId: 'u99', // Someone else
    title: 'Backend Java Developer',
    company: 'Enterprise Corp',
    location: 'New York, NY',
    type: JobType.FULL_TIME,
    salaryRange: '$130k - $160k',
    description: 'Maintain and scale our legacy Java Spring Boot systems.',
    requirements: ['Java', 'Spring Boot', 'Hibernate', 'MySQL'],
    postedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString()
  }
];

export const MOCK_APPLICATIONS = [
  {
    id: 'a1',
    jobId: 'j1',
    candidateId: 'u2',
    candidateName: 'John Developer',
    candidateEmail: 'dev@jobflow.com',
    resumeUrl: 'mock_resume.pdf',
    status: ApplicationStatus.REVIEWING,
    appliedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString()
  }
];
