'use client';

import { ChatWindow } from './components/Chat/ChatWindow';
import { Box, Text, useColorModeValue } from '@chakra-ui/react';

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
