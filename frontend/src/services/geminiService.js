export const generateJobDescription = async (title, company, requirements) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  return `
# Job Description: ${title}
## Company: ${company}

We are looking for a talented ${title} to join our team at ${company}.

### Key Responsibilities:
- Lead the development of high-quality software solutions
- Collaborate with cross-functional teams
- Mentor junior developers and conduct code reviews
- Drive technical innovation and best practices

### Requirements:
${requirements ? requirements.split(',').map(req => `- ${req.trim()}`).join('\n') : '- Bachelor\'s degree in Computer Science or related field\n- 3+ years of relevant experience\n- Strong problem-solving skills'}

### Benefits:
- Competitive salary and equity package
- Flexible working hours and remote options
- Health, dental, and vision insurance
- Professional development budget

Apply now to join our growing team!
  `.trim();
};
