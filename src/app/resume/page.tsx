'use client'

import {
  Box,
  Button,
  Container,
  Divider,
  Grid,
  Heading,
  List,
  ListItem,
  Text,
  VStack,
  useColorModeValue,
} from '@chakra-ui/react';
import { Download } from 'lucide-react';

const SectionHeader = ({ children }: { children: React.ReactNode }) => {
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  return (
    <Heading 
      as="h2" 
      size="md" 
      mb={4} 
      pb={2} 
      borderBottom="2px" 
      borderColor={borderColor}
    >
      {children}
    </Heading>
  );
};

export interface ResumeData {
  name: string;
  contact: {
    location: string;
    phone: string;
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

const resumeData: ResumeData = {
  name: "JONATHAN MADDISON",
  contact: {
    location: "Burlington, VT",
    phone: "(802) 734-1161",
    email: "jonathanwmaddison@gmail.com"
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

export default function ResumePage() {
  const handlePrint = () => {
    window.print();
  };

  const bg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const headingColor = useColorModeValue('gray.800', 'white');

  return (
    <Box position="relative" minH="100vh" py={8}>
      {/* Action Buttons */}
      <Box 
        position="fixed" 
        top={4} 
        right={4}
        display="flex"
        gap={2}
        className="no-print"
      >
        <Button
          onClick={handlePrint}
          leftIcon={<Download size={16} />}
          colorScheme="gray"
          variant="solid"
        >
          Download/Print
        </Button>

      </Box>

      {/* Resume Content */}
      <Container maxW="4xl" bg={bg} p={8}>
        {/* Header */}
        <VStack mb={8} pb={3} borderBottom="2px" borderColor={headingColor}>
          <Heading as="h1" size="xl" color={headingColor} mb={2}>
            {resumeData.name}
          </Heading>
          <Text color={textColor}>
            {resumeData.contact.location} | {resumeData.contact.phone} | {resumeData.contact.email}
          </Text>
        </VStack>

        {/* Professional Summary */}
        <Box mb={8}>
          <SectionHeader>PROFESSIONAL SUMMARY</SectionHeader>
          <Text color={textColor} fontSize={{ print: 'sm' }}>
            {resumeData.summary}
          </Text>
        </Box>

        {/* Skills */}
        <Box mb={8}>
          <SectionHeader>TECHNICAL SKILLS</SectionHeader>
          <Grid className="skills-grid" templateColumns={{ base: 'repeat(2, 1fr)', print: 'repeat(2, 1fr)' }} gap={2} color={textColor} fontSize={{ print: 'sm' }}>
            <Box>
              <Text as="span" fontWeight="bold">Frontend: </Text>
              <Text as="span">{resumeData.skills.frontend}</Text>
            </Box>
            <Box>
              <Text as="span" fontWeight="bold">Backend: </Text>
              <Text as="span">{resumeData.skills.backend}</Text>
            </Box>
            <Box>
              <Text as="span" fontWeight="bold">DevOps: </Text>
              <Text as="span">{resumeData.skills.devops}</Text>
            </Box>
            <Box>
              <Text as="span" fontWeight="bold">AI: </Text>
              <Text as="span">{resumeData.skills.ai}</Text>
            </Box>
          </Grid>
        </Box>

        {/* Projects */}
        <Box mb={8}>
          <SectionHeader>INDEPENDENT AI PROJECTS</SectionHeader>
          {resumeData.projects.map((project, index) => (
            <Box key={index} mb={4}>
              <Box display="flex" justifyContent="space-between" alignItems="baseline" mb={2}>
                <Text fontWeight="bold" color={headingColor}>
                  {project.title}
                </Text>
                <Text color={textColor} fontStyle="italic">
                  {project.period}
                </Text>
              </Box>
              <List spacing={2} pl={6} styleType="disc" color={textColor} fontSize={{ print: 'sm' }}>
                {project.details.map((detail, idx) => (
                  <ListItem key={idx}>{detail}</ListItem>
                ))}
              </List>
            </Box>
          ))}
        </Box>

        {/* Experience */}
        <Box mb={8}>
          <SectionHeader>PROFESSIONAL EXPERIENCE</SectionHeader>
          {resumeData.experience.map((exp, index) => (
            <Box key={index} className="experience-section" mb={4}>
              <Box display="flex" justifyContent="space-between" alignItems="baseline" mb={2}>
                <Heading as="h3" size="sm" color={headingColor}>
                  {exp.title} · <Text as="span" fontWeight="bold">{exp.company}</Text>
                </Heading>
                <Text color={textColor} fontStyle="italic">{exp.period}</Text>
              </Box>
              <List spacing={2} pl={6} styleType="disc" color={textColor} fontSize={{ print: 'sm' }}>
                {exp.details.map((detail, idx) => (
                  <ListItem key={idx}>{detail}</ListItem>
                ))}
              </List>
            </Box>
          ))}
        </Box>

        {/* Education */}
        <Box>
          <Heading as="h2" size="md" color={headingColor} mb={3} pb={1} borderBottom="1px" borderColor={headingColor}>
            EDUCATION
          </Heading>
          <VStack spacing={2} align="stretch" fontSize={{ print: 'sm' }}>
            {resumeData.education.map((edu, index) => (
              <Box key={index} className="education-item">
                <Text as="span" fontWeight="bold" color={headingColor}>
                  {edu.degree}
                </Text>
                <Text as="span" color={textColor} mx={1}>·</Text>
                <Text as="span" color={textColor}>
                  {edu.institution}
                </Text>
                <Text as="span" color={textColor} fontStyle="italic" ml={1}>
                  ({edu.year})
                </Text>
              </Box>
            ))}
          </VStack>
        </Box>
      </Container>

      <style jsx global>{`
        @media print {
          @page {
            margin: 0.4in;
            size: letter;
          }
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
            font-size: 0.9em;
            line-height: 1.3;
          }
          .no-print {
            display: none !important;
          }
          /* Prevent orphaned headers */
          h2 {
            break-after: avoid;
          }
          /* Keep job titles with at least 2-3 bullet points */
          h3 {
            break-after: avoid;
          }
          /* Prevent breaking inside job sections */
          .experience-section {
            break-inside: avoid;
          }
          /* Keep education items together */
          .education-item {
            break-inside: avoid;
          }
          /* Ensure skills stay together */
          .skills-grid {
            break-inside: avoid;
          }
        }
      `}</style>
    </Box>
  );
}
