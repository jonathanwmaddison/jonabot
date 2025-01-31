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
import { resumeData, type ResumeData } from '../../lib/resumeData';

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
