'use client';

import dynamic from 'next/dynamic';
import { Box, Text, useColorModeValue } from '@chakra-ui/react';

// Dynamically import ChatWindow with no SSR to reduce initial bundle size
const ChatWindow = dynamic(
  () => import('./components/Chat/ChatWindow').then(mod => ({ default: mod.ChatWindow })),
  { ssr: false }
);

export default function Home() {
  const textColor = useColorModeValue('gray.600', 'gray.400');
  
  return (
    <Box as="main">
      <Text 
        fontSize="md" 
        color={textColor}
        textAlign="center" 
        py={2}
        borderBottom="1px solid"
        borderColor={useColorModeValue('gray.100', 'gray.700')}
      >
        Jonathan Maddison | AI Chat Assistant
      </Text>
      <ChatWindow />
    </Box>
  );
}
