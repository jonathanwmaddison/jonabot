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
  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.100', 'gray.700');

  return (
    <Box w="full" h="calc(100vh - 40px)">
      <Box
        h="full"
        bg={bg}
        display="flex"
        flexDirection="column"
      >
        <Box
          flex="1"
          overflowY="auto"
          px={4}
          css={{
            '&::-webkit-scrollbar': { width: '4px' },
            '&::-webkit-scrollbar-track': { background: 'transparent' },
            '&::-webkit-scrollbar-thumb': { background: 'gray.200' },
          }}
        >
          <Box maxW="4xl" mx="auto" py={4}>
            <VStack spacing={4} align="stretch" w="full">
              {/* Bot Message */}
              <HStack spacing={2} alignSelf="flex-start">
                <SkeletonCircle size="8" />
                <Box maxW={{ base: '70%', md: '60%' }}>
                  <Skeleton height="20px" width="240px" mb={2} />
                  <Skeleton height="20px" width="180px" />
                </Box>
              </HStack>
            </VStack>
          </Box>
        </Box>

        <Box borderTop="1px solid" borderColor={borderColor}>
          <Box maxW="4xl" mx="auto" w="full">
            {/* Suggested Prompts */}
            <Box py={2} px={4}>
              <HStack spacing={2}>
                <Skeleton height="32px" width="120px" borderRadius="md" />
                <Skeleton height="32px" width="140px" borderRadius="md" />
                <Skeleton height="32px" width="100px" borderRadius="md" />
              </HStack>
            </Box>
            
            {/* Input Area */}
            <Box p={4}>
              <Skeleton height="40px" borderRadius="md" />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
} 