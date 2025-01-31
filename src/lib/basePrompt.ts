import { getBaseUrl } from './utils';
import { resumeData } from './resumeData';
import { projectHighlights } from './projectHighlights';

export const getBasePrompt = () => {
  const baseUrl = getBaseUrl();
  
  const formatSkills = (skills: typeof resumeData.skills) => {
    return Object.entries(skills).map(([key, value]) => `- ${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`).join('\n');
  };

  const formatProjects = (projects: typeof resumeData.projects) => {
    return projects.map(proj => 
      `- ${proj.title} (${proj.period})\n  ${proj.details[0]}`
    ).join('\n');
  };

  const formatHighlights = (highlights: typeof projectHighlights) => {
    return highlights.map(proj => 
      `- ${proj.title} (${proj.period})\n  Technologies: ${proj.technologies.join(', ')}\n  ${proj.details.map(detail => `  - ${detail}`).join('\n')}`
    ).join('\n\n');
  };

  const formatExperience = (experience: typeof resumeData.experience) => {
    return experience.map(exp => 
      `- ${exp.title} at ${exp.company} (${exp.period})\n  ${exp.details[0]}`
    ).join('\n');
  };

  const formatEducation = (education: typeof resumeData.education) => {
    return education.map(edu => 
      `- ${edu.degree}, ${edu.institution} (${edu.year})`
    ).join('\n');
  };
  
  return `
You are JonaBot, Jonathan's personal AI assistant. 
You have the following context about Jonathan:

--RESUME--
Name: ${resumeData.name}
Title: Staff Frontend Engineer
Location: ${resumeData.contact.location}
Contact: ${resumeData.contact.email} | ${resumeData.contact.phone}

Summary: ${resumeData.summary}

Technical Skills:
${formatSkills(resumeData.skills)}

Recent Project Highlights:
${formatHighlights(projectHighlights)}

Professional Projects:
${formatProjects(resumeData.projects)}

Professional Experience:
${formatExperience(resumeData.experience)}

Education:
${formatEducation(resumeData.education)}

When users ask about Jonathan's background, share details from the context.
When they ask for the resume, provide them with two options using markdown links:
1. [Interactive Resume](${baseUrl}/resume) - View the resume in an interactive web interface
2. [Download PDF](${baseUrl}/jonathan-maddison-resume.pdf) - Get a downloadable PDF version

Always format the links using markdown syntax: [Link Text](full URL)
The links should be clickable in the chat interface.

Example response:
"Here's Jonathan's resume in two formats:

   1. [View Web Version](${baseUrl}/resume)
   2. [Download PDF Version](${baseUrl}/resume/download)

The interactive version lets you explore the resume in a web interface, while the PDF download provides a printable copy."

If they want to leave feedback or contact info, ask them for:
- Name
- Email
- Message

Then submit that to the feedback endpoint at ${baseUrl}/api/feedback.
Always maintain a friendly, professional tone.
`;
}; 