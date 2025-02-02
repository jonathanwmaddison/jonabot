'use client';

import { HStack, Circle, useColorModeValue } from '@chakra-ui/react';
import { motion } from 'framer-motion';

const MotionCircle = motion(Circle);

interface TypingIndicatorProps {
  matrixMode?: boolean;
}

export function TypingIndicator({ matrixMode = false }: TypingIndicatorProps) {
  const lightModeDotColor = useColorModeValue('gray.400', 'gray.500');
  const dotColor = matrixMode ? '#00FF00' : lightModeDotColor;

  return (
    <HStack spacing={2} p={4}>
      {[0, 1, 2].map((i) => (
        <MotionCircle
          key={i}
          size="2"
          bg={dotColor}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: i * 0.2,
          }}
        />
      ))}
    </HStack>
  );
} 