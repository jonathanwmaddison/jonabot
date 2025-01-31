'use client';

import { extendTheme } from '@chakra-ui/react'
import { themeConfig } from './theme.config'

const theme = extendTheme({
  config: themeConfig,
  styles: {
    global: {
      body: {
        bg: 'gray.50',
        _dark: {
          bg: 'gray.900',
        },
      },
    },
  },
  components: {
    Card: {
      baseStyle: {
        container: {
          borderRadius: 'xl',
        },
      },
    },
  },
});

export default theme; 