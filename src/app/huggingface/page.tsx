'use client';

import { Box, Image, Container, useColorModeValue } from '@chakra-ui/react';
import dynamic from 'next/dynamic';

// Use dynamic import so that ChatWindow only loads on the client
const EmployerChatWindow = dynamic(
  () => import('../components/Chat/ChatWindow').then(mod => ({ default: mod.ChatWindow })),
  { ssr: false }
);

const HUGGINGFACE_COMMANDS = [
  { name: '/help', description: 'Show available commands' },
  { name: '/resume', description: 'View or download resume' },
  { name: '/projects', description: 'List key projects' },
  { name: '/skills', description: 'Show technical skills' },
  { name: '/contact', description: 'Contact Jonathan' },
];

export default function HuggingFacePage() {
  // Official Hugging Face brand colors
  const bg = useColorModeValue('white', '#1a1a1a');
  const brandOrange = '#FF9D00';
  const textColor = useColorModeValue('gray.800', 'white');
  const borderColor = useColorModeValue(`${brandOrange}33`, brandOrange);

  // Hugging Face font stack
  const fontFamily = '"Source Sans Pro",ui-sans-serif,system-ui,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji"';

  // Color mode values
  const logoBg = useColorModeValue('white', bg);

  const initialMessage = `Hi! 👋 I'm here to discuss Jonathan's Frontend Engineer application (Jan 29, 2024).

Ask me about his:
* AI integration experience
* UI component libraries & design systems
* Open-source contributions
* Technical team collaboration

This chat interface demonstrates his skills in action. How can I help you evaluate his fit for Hugging Face?`;

  return (
    <Box minH="100vh" bg={bg} color={textColor} position="relative" fontFamily={fontFamily}>
      {/* Fixed position logo */}
      <Box
        position="fixed"
        top={4}
        right={4}
        bg={logoBg}
        p={2}
        borderRadius="lg"
        width="60px"
        zIndex={10}
        opacity={0.9}
        _hover={{ opacity: 1 }}
        transition="all 0.2s"
      >
        <Image
          src="/huggingface-logo.svg"
          alt="Hugging Face Logo"
          width="100%"
          height="auto"
          objectFit="contain"
        />
      </Box>

      <Container maxW="7xl" position="relative">
        <EmployerChatWindow 
          apiEndpoint="/api/huggingface-chat" 
          customTheme={{
            background: bg,
            accentColor: brandOrange,
            textColor: textColor,
            fontFamily: fontFamily,
            inputBorderColor: borderColor,
            inputFocusBorderColor: brandOrange,
            buttonBg: brandOrange,
            buttonHoverBg: `${brandOrange}CC`,
            messageBubbleBg: useColorModeValue('gray.50', `${brandOrange}11`),
            messageBubbleBorderColor: useColorModeValue(`${brandOrange}22`, `${brandOrange}33`),
          }}
          initialMessage={initialMessage}
          commands={HUGGINGFACE_COMMANDS}
        />
      </Container>
    </Box>
  );
}