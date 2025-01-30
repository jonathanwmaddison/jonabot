'use client';

import { memo, useState } from 'react';
import {
  Box,
  Text,
  useColorModeValue,
  HStack,
  VStack,
  IconButton,
  useClipboard,
  useToast,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { FiCopy, FiCheck } from 'react-icons/fi';
import { Avatar } from './Avatar';

interface MessageProps {
  message: {
    role: string;
    content: string;
    timestamp?: Date;
  };
}

const MotionBox = motion(Box);

function formatTime(date?: Date): string {
  if (!date) return '';
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  }).format(date);
}

function CodeBlock({ children, isUser }: { children: string; isUser: boolean }) {
  const { onCopy, hasCopied } = useClipboard(children);
  const toast = useToast();
  const bgColor = isUser ? 'blue.600' : 'gray.200';
  const color = isUser ? 'white' : 'gray.800';

  const handleCopy = () => {
    onCopy();
    toast({
      title: 'Code copied',
      status: 'success',
      duration: 2000,
      isClosable: true,
    });
  };

  return (
    <Box position="relative" mt={2} mb={2}>
      <HStack
        bg={bgColor}
        color={color}
        p={2}
        borderRadius="md"
        overflow="hidden"
        spacing={2}
      >
        <Text
          as="code"
          flex="1"
          fontSize="sm"
          whiteSpace="pre-wrap"
          wordBreak="break-word"
        >
          {children}
        </Text>
        <IconButton
          aria-label="Copy code"
          icon={hasCopied ? <FiCheck /> : <FiCopy />}
          size="sm"
          variant="ghost"
          onClick={handleCopy}
          color={color}
          _hover={{
            bg: isUser ? 'blue.700' : 'gray.300',
          }}
        />
      </HStack>
    </Box>
  );
}

export const MessageBubble = memo(function MessageBubble({ message }: MessageProps) {
  const isUser = message.role === 'user';
  
  const bg = useColorModeValue(
    isUser ? 'blue.500' : 'gray.100',
    isUser ? 'blue.400' : 'gray.700'
  );
  const color = useColorModeValue(
    isUser ? 'white' : 'gray.900',
    isUser ? 'white' : 'gray.100'
  );
  const timeColor = useColorModeValue('gray.500', 'gray.400');

  return (
    <VStack
      spacing={1}
      align={isUser ? 'flex-end' : 'flex-start'}
      w="full"
    >
      <HStack
        spacing={2}
        w="full"
        justify={isUser ? 'flex-end' : 'flex-start'}
      >
        {!isUser && <Avatar role={message.role} size="md" />}
        <MotionBox
          maxW={{ base: '75%', md: '70%' }}
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <Box
            bg={bg}
            color={color}
            px={4}
            py={2}
            borderRadius="xl"
            borderTopLeftRadius={!isUser ? 'sm' : undefined}
            borderTopRightRadius={isUser ? 'sm' : undefined}
          >
            <ReactMarkdown
              components={{
                p: ({ children }) => <Text mb={2}>{children}</Text>,
                a: ({ href, children }) => (
                  <Text
                    as="a"
                    href={href}
                    color={isUser ? 'white' : 'blue.500'}
                    textDecoration="underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {children}
                  </Text>
                ),
                code: ({ children }) => (
                  <CodeBlock isUser={isUser}>{children as string}</CodeBlock>
                ),
              }}
            >
              {message.content}
            </ReactMarkdown>
          </Box>
        </MotionBox>
        {isUser && <Avatar role={message.role} size="md" />}
      </HStack>
      <Box
        alignSelf={isUser ? 'flex-end' : 'flex-start'}
        ml={!isUser ? '40px' : undefined}
        mr={isUser ? '40px' : undefined}
      >
        {message.timestamp && (
          <Text
            fontSize="xs"
            color={timeColor}
          >
            {formatTime(message.timestamp)}
          </Text>
        )}
      </Box>
    </VStack>
  );
}); 