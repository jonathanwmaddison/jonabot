'use client';

import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import { CacheProvider } from '@chakra-ui/next-js';
import { ChatProvider } from './components/Chat/ChatContext';
import theme from './theme';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CacheProvider>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <ChakraProvider theme={theme}>
        <ChatProvider>{children}</ChatProvider>
      </ChakraProvider>
    </CacheProvider>
  );
} 