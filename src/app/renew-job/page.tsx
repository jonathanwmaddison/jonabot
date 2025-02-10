'use client';

import { Box, Image, Container, useColorModeValue } from '@chakra-ui/react';
import dynamic from 'next/dynamic';

// Use dynamic import so that ChatWindow only loads on the client
const EmployerChatWindow = dynamic(
  () => import('../components/Chat/ChatWindow').then(mod => ({ default: mod.ChatWindow })),
  { ssr: false }
);

const RENEW_COMMANDS = [
  { name: '/help', description: 'Show available commands' },
  { name: '/resume', description: 'View or download resume' },
  { name: '/projects', description: 'List key projects' },
  { name: '/skills', description: 'Show technical skills' },
  { name: '/contact', description: 'Contact me' },
  { name: '/experience', description: 'Show relevant experience' },
];

export default function RenewJobPage() {
  const bg = useColorModeValue('var(--color-background)', 'var(--color-primary)');
  const textColor = useColorModeValue('var(--color-text-primary)', 'var(--color-text-white)');
  const borderColor = useColorModeValue('var(--color-primary)', 'var(--color-text-white)');

  const initialMessage = `Hi! 👋 I'm an AI assistant designed to help you learn about Jonathan's qualifications for the Staff Software Engineer position at Renew Home.

This chat interface demonstrates his technical abilities in action - built with modern web technologies and seamless AI integration.

I can provide specific examples of:
* Technical leadership and architectural decisions
* Complex systems he's built and scaled
* Team mentoring and collaboration experience
* Experience with your tech stack (TypeScript, React, Remix, NX)
* Approach to technical challenges and innovation

What aspects of Jonathan's background would you like to explore?`;

  return (
    <Box 
      minH="100vh" 
      bg={bg} 
      color={textColor}
      className="padding-global"
    >
      <Container maxW="var(--max-width-content)" px={0}>
        <div className="chat-container">
          <Box className="text-style-eyebrow" textAlign="center" pt={6}>
            Staff Software Engineer Position
          </Box>
          
          <Box 
            as="h1" 
            textAlign="center" 
            fontSize="2xl" 
            fontFamily="var(--font-work-sans)" 
            fontWeight="600"
            mb={6}
          >
            Renew Home Application Assistant
          </Box>

          <EmployerChatWindow 
            apiEndpoint="/api/renew-job-chat" 
            customTheme={{
              background: 'transparent',
              accentColor: 'var(--color-primary)',
              textColor: textColor,
              fontFamily: 'var(--font-inter)',
              inputBorderColor: 'var(--color-secondary)',
              inputFocusBorderColor: 'var(--color-primary)',
              buttonBg: 'var(--color-primary)',
              buttonHoverBg: 'var(--color-button-hover)',
              messageBubbleBg: 'var(--color-secondary)',
              messageBubbleBorderColor: 'var(--color-secondary)',
            }}
            initialMessage={initialMessage}
            commands={RENEW_COMMANDS}
          />
        </div>
      </Container>
    </Box>
  );
} 