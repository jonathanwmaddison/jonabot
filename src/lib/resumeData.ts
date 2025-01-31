export interface ResumeData {
  name: string;
  contact: {
    location: string;
    email: string;
  };
  summary: string;
  skills: {
    frontend: string;
    backend: string;
    devops: string;
    ai: string;
  };
  projects: Array<{
    title: string;
    period: string;
    details: string[];
  }>;
  experience: Array<{
    title: string;
    company: string;
    period: string;
    details: string[];
  }>;
  education: Array<{
    degree: string;
    institution: string;
    year: string;
  }>;
}

export const resumeData: ResumeData = {
  name: "JONATHAN MADDISON",
  contact: {
    location: "Burlington, VT",
    email: "jonathanwm84@gmail.com"
  },
  summary: "Staff-level engineer specializing in scalable front-end systems and AI integration. Expert in React/React Native, microservices architecture, and cloud deployment. Track record of leading teams, mentoring developers, and delivering complex architectural changes while maintaining velocity.",
  skills: {
    frontend: "React, TypeScript, Next.js, React Query, Redux, Module Federation, Webpack, Vite, Tailwind CSS, React Native, Expo, Native Modules, App Store Deployment, Mobile CI/CD",
    backend: "Node.js, Nest.js, PostgreSQL, Event-Driven Architecture, Domain-Driven Design",
    devops: "AWS (Lambda, ECS, CloudFormation), Docker, GitLab/Github CI/CD, Monitoring",
    ai: "OpenAI APIs, Local LLM Integration (llama.cpp), RAG Systems, Tool Calling, AI Enhanced Development"
  },
  projects: [
    {
      title: "Advanced AI Integration Projects",
      period: "2024 - Present",
      details: [
        "Built React Native app integrating billion-parameter LLMs (Llama 3.2) locally on iOS devices",
        "Implemented RAG systems for semantic search and data analysis in government transcripts",
        "Developed AI-powered meal planning application with intelligent recipe generation",
        "Learned best practices for AI-assisted development and code quality"
      ]
    }
  ],
  experience: [
    {
      title: "Staff Frontend Engineer",
      company: "Paige",
      period: "2024",
      details: [
        "Led team building AI-integrated digital pathology viewer in regulated medical environment",
        "Spearheaded microfrontend architecture, reducing release complexity while maintaining compliance",
        "Established deployment strategies with site reliability team",
        "Successfully launched product securing major partnerships"
      ]
    },
    {
      title: "Senior Frontend Engineer",
      company: "Paige",
      period: "2021 - 2023",
      details: [
        "Led feature development and performance improvements for digital pathology case management tool",
        "Architected and implemented frontend tagging system for client-facing product across our case management frontend and pathology viewer applications",
        "Collaborated with cross-functional teams on product functionality and UI/UX"
      ]
    },
    {
      title: "Senior Software Engineer",
      company: "Grasshopper Bank",
      period: "Mar 2021 - Oct 2021",
      details: [
        "Led migration to microservices architecture with Nest.js, AWS Lambda, and event-driven patterns",
        "Implemented authorization service with flexible role mapping for banking requirements",
        "Mentored junior engineer while delivering full-stack solution on schedule"
      ]
    },
    {
      title: "Software Engineer",
      company: "Grasshopper Bank",
      period: "2018 - 2021",
      details: [
        "Added essential features to the bank onboarding process and mobile application with React/React Native and Node.js",
        "Developed custom Native Modules enabling critical mobile functionality",
        "Led implementation of unified web/mobile deployment strategy",
        "Established automated testing improving release reliability across platforms"
      ]
    },
    {
      title: "Software Engineer",
      company: "OTTO Health",
      period: "2017 - 2018",
      details: [
        "Led transition from Cordova to React Native for mobile applications",
        "Improved release process and reduced bugs in critical user flows"
      ]
    },
    {
      title: "Software Engineer",
      company: "AlzCare Labs",
      period: "Jun 2017 - Oct 2017",
      details: [
        "Co-led a team of interns building FindMe app for caregivers and family members of people with dementia",
        "Used agile development methods including scrum meetings and sprint planning to improve team communication and deliver milestones",
        "Built reusable React Native component library with unit testing using Jest",
        "Implemented component styling and animations to design specifications"
      ]
    }
  ],
  education: [
    {
      degree: "Master of Public Administration",
      institution: "University of Vermont",
      year: "2011"
    },
    {
      degree: "B.S. Community and International Development",
      institution: "University of Vermont",
      year: "2009"
    }
  ]
}; 