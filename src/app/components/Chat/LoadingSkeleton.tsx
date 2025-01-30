'use client';

import {
  Box,
  Skeleton,
  SkeletonCircle,
  VStack,
  HStack,
  useColorModeValue,
} from '@chakra-ui/react';

export function LoadingSkeleton() {
  const bgColor = useColorModeValue('gray.100', 'gray.700');

  return (
    <VStack spacing={6} w="full" pt={4}>
      {/* Bot Message */}
      <HStack spacing={2} alignSelf="flex-start" w="full">
        <SkeletonCircle size="8" />
        <Box maxW={{ base: '75%', md: '70%' }}>
          <Skeleton height="20px" width="200px" mb={2} />
          <Skeleton height="20px" width="150px" />
        </Box>
      </HStack>

      {/* User Message */}
      <HStack spacing={2} alignSelf="flex-end" w="full">
        <Box maxW={{ base: '75%', md: '70%' }} ml="auto">
          <Skeleton height="20px" width="180px" mb={2} />
          <Skeleton height="20px" width="120px" />
        </Box>
        <SkeletonCircle size="8" />
      </HStack>

      {/* Bot Message */}
      <HStack spacing={2} alignSelf="flex-start" w="full">
        <SkeletonCircle size="8" />
        <Box maxW={{ base: '75%', md: '70%' }}>
          <Skeleton height="20px" width="250px" mb={2} />
          <Skeleton height="20px" width="200px" mb={2} />
          <Skeleton height="20px" width="180px" />
        </Box>
      </HStack>

      {/* Input Area */}
      <Box
        position="absolute"
        bottom={4}
        left={4}
        right={4}
        p={4}
        borderTop="1px solid"
        borderColor={useColorModeValue('gray.200', 'gray.600')}
      >
        <Skeleton height="40px" borderRadius="md" />
      </Box>
    </VStack>
  );
} 