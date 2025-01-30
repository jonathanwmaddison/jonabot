'use client';

import { Box, Icon, useColorModeValue } from '@chakra-ui/react';
import { memo } from 'react';
import { FiUser } from 'react-icons/fi';
import { RiRobot2Fill } from 'react-icons/ri';

interface AvatarProps {
  role: string;
  size?: 'sm' | 'md' | 'lg';
}

const SIZES = {
  sm: '24px',
  md: '32px',
  lg: '40px',
};

const ICON_SIZES = {
  sm: '14px',
  md: '18px',
  lg: '24px',
};

export const Avatar = memo(function Avatar({ role, size = 'md' }: AvatarProps) {
  const isBot = role === 'assistant';
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const bgColor = useColorModeValue(
    isBot ? 'blue.500' : 'gray.100',
    isBot ? 'blue.600' : 'gray.700'
  );
  const iconColor = useColorModeValue(
    isBot ? 'white' : 'gray.600',
    isBot ? 'white' : 'gray.200'
  );

  const dimension = SIZES[size];
  const iconSize = ICON_SIZES[size];

  return (
    <Box
      width={dimension}
      height={dimension}
      borderRadius="full"
      border="2px solid"
      borderColor={borderColor}
      bg={bgColor}
      flexShrink={0}
      display="flex"
      alignItems="center"
      justifyContent="center"
      transition="all 0.2s"
      _hover={{
        transform: 'scale(1.05)',
      }}
    >
      <Icon
        as={isBot ? RiRobot2Fill : FiUser}
        boxSize={iconSize}
        color={iconColor}
      />
    </Box>
  );
}); 