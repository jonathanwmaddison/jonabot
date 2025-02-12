'use client';

import { Box, Image, Container, useColorModeValue } from '@chakra-ui/react';
import dynamic from 'next/dynamic';

// Use dynamic import so that ChatWindow only loads on the client
const EmployerChatWindow = dynamic(
  () => import('../components/Chat/ChatWindow').then(mod => ({ default: mod.ChatWindow })),
  { ssr: false }
);

const ENERGYHUB_COMMANDS = [
  { name: '/help', description: 'Show available commands' },
  { name: '/resume', description: 'View or download resume' },
  { name: '/projects', description: 'List key projects' },
  { name: '/skills', description: 'Show technical skills' },
  { name: '/contact', description: 'Contact Jonathan' },
  { name: '/mobile', description: 'Mobile development experience' },
  { name: '/react', description: 'React & React Native experience' },
];

const ENERGYHUB_PROMPTS = [
  {
    text: "React Native",
    prompt: "Tell me about Jonathan's React Native experience and how he's enhanced existing mobile applications?"
  },
  {
    text: "Mobile Dev",
    prompt: "What's Jonathan's experience with mobile development infrastructure, iOS/Android store requirements, and deployment processes?"
  },
  {
    text: "UX Design",
    prompt: "How has Jonathan worked with designers and used tools like Figma to implement mobile and web applications?"
  },
  {
    text: "TypeScript",
    prompt: "What's Jonathan's experience with TypeScript in production applications?"
  },
  {
    text: "Security & A11y",
    prompt: "Can you describe Jonathan's experience with security and accessibility in mobile applications?"
  },
  {
    text: "❓ Help",
    prompt: "/help"
  }
];

export default function EnergyHubPage() {
  // EnergyHub brand colors - using a clean, professional palette
  const bg = useColorModeValue('white', '#1a1a1a');
  const brandBlue = '#0066CC'; // Professional blue color
  const textColor = useColorModeValue('gray.800', 'white');
  const borderColor = useColorModeValue(`${brandBlue}33`, brandBlue);

  // Modern font stack
  const fontFamily = 'Inter, system-ui, sans-serif';

  const initialMessage = `Hi! 👋 I'm here to discuss Jonathan's Frontend Engineer application for the EV team at EnergyHub.

Ask me about his:
* React & React Native expertise
* Mobile app development experience
* UI/UX implementation skills
* TypeScript proficiency
* Experience with design tools like Figma

How can I help you evaluate his fit for EnergyHub's EV team?`;

  return (
    <Box 
      minH="100vh" 
      bg={bg} 
      color={textColor}
      position="relative" 
      fontFamily={fontFamily}
    >
      <Container maxW="7xl" position="relative">
        <Box 
          display="flex"
          justifyContent="center"
          pt={20}
          mb={8}
        >
          <Box textAlign="center">
            <Box 
              as="h1" 
              fontSize="2xl"
              fontWeight="600"
              mb={1}
            >
              Jonathan's Application Assistant
            </Box>
            <Box color={brandBlue} fontWeight="500" fontSize="sm">
              Senior Frontend Engineer Position
            </Box>
            <Box color={brandBlue} fontWeight="500" fontSize="sm">
            Energy Hub's EV Team

            </Box>
          </Box>
        </Box>

        <EmployerChatWindow 
          apiEndpoint="/api/energyhub-chat" 
          customTheme={{
            background: bg,
            accentColor: brandBlue,
            textColor: textColor,
            fontFamily: fontFamily,
            inputBorderColor: borderColor,
            inputFocusBorderColor: brandBlue,
            buttonBg: brandBlue,
            buttonHoverBg: `${brandBlue}CC`,
            messageBubbleBg: useColorModeValue('gray.50', `${brandBlue}11`),
            messageBubbleBorderColor: useColorModeValue(`${brandBlue}22`, `${brandBlue}33`),
          }}
          initialMessage={initialMessage}
          commands={ENERGYHUB_COMMANDS}
          customPrompts={ENERGYHUB_PROMPTS}
        />
      </Container>
    </Box>
  );
} 