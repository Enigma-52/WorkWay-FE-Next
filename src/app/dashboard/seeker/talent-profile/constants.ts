export const CATEGORIES = [
  "AI/ML Engineering",
  "Backend Engineering",
  "Blockchain/Web3",
  "Cloud/Infrastructure",
  "Cybersecurity",
  "Data Engineering",
  "Data Science",
  "Database Administration",
  "Design",
  "DevOps/SRE",
  "Embedded Systems",
  "Frontend Engineering",
  "Full-Stack Engineering",
  "Game Development",
  "Hardware Engineering",
  "IoT Engineering",
  "Mobile Development",
  "Network Engineering",
  "Product Management",
  "QA/Testing",
  "Research",
  "Robotics",
  "Sales Engineering",
  "Solutions Architecture",
  "Systems Programming",
  "Technical Writing",
] as const;

export const EXPERIENCE_LEVELS = [
  "Entry-level",
  "Mid-level",
  "Senior",
  "Staff",
  "Principal",
] as const;

export const EMPLOYMENT_TYPES = [
  "Full-time",
  "Part-time",
  "Contract",
  "Freelance",
  "Internship",
] as const;

export const AVAILABILITY_STATUSES = [
  { value: "available", label: "Available for hire" },
  { value: "open", label: "Open to opportunities" },
  { value: "not_available", label: "Not currently available" },
] as const;

export const LANGUAGE_PROFICIENCIES = [
  "Native",
  "Fluent",
  "Professional",
  "Conversational",
  "Basic",
] as const;

export const COMMON_SKILLS = [
  "JavaScript", "TypeScript", "Python", "Java", "Go", "Rust", "C++", "C#", "Ruby", "PHP", "Swift", "Kotlin",
  "React", "Next.js", "Vue.js", "Angular", "Svelte", "Node.js", "Express", "Django", "FastAPI", "Spring Boot",
  "PostgreSQL", "MySQL", "MongoDB", "Redis", "Elasticsearch",
  "AWS", "GCP", "Azure", "Docker", "Kubernetes", "Terraform",
  "GraphQL", "REST API", "gRPC", "WebSocket",
  "Git", "CI/CD", "Linux", "Nginx",
  "TensorFlow", "PyTorch", "LangChain", "OpenAI API",
  "Figma", "Tailwind CSS", "HTML", "CSS",
] as const;

export const COMMON_LANGUAGES = [
  "English", "Spanish", "French", "German", "Portuguese", "Chinese (Mandarin)", "Chinese (Cantonese)",
  "Japanese", "Korean", "Hindi", "Arabic", "Russian", "Italian", "Dutch", "Swedish",
  "Turkish", "Polish", "Thai", "Vietnamese", "Indonesian", "Malay", "Bengali", "Tamil", "Urdu",
] as const;

export const RESERVED_USERNAMES = new Set([
  "admin", "api", "jobs", "support", "login", "signup", "dashboard", "settings",
  "profile", "search", "about", "contact", "help", "terms", "privacy", "blog", "null", "undefined",
]);
