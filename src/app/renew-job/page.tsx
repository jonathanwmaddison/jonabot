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

  const initialMessage = `Hi! 👋 I'm here to help with your Staff Software Engineer application at Renew Home.

I can assist you with:
* Understanding the role requirements
* Highlighting your relevant experience
* Technical interview preparation
* Leadership & mentoring examples
* Questions about Renew's mission and impact

How can I help you prepare for this opportunity?`;

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