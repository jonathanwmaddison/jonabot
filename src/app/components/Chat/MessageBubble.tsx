'use client';

import { memo } from 'react';
import {
  Box,
  Text,
  useColorModeValue,
  HStack,
  VStack,
  IconButton,
  useClipboard,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { FiCopy, FiCheck } from 'react-icons/fi';
import { Avatar } from './Avatar';
import { Pong } from '../Games/Pong';
import { ContactForm } from './ContactForm';
import { useChat } from './ChatContext';

const MotionBox = motion(Box);

interface Message {
  role: string;
  content: string;
  timestamp?: Date;
}

interface MessageProps {
  message: Message;
  isLast: boolean;
}

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

export const MessageBubble = memo(function MessageBubble({ message, isLast }: MessageProps) {
  const isUser = message.role === 'user';
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { sendMessage } = useChat();
  
  const bg = useColorModeValue(
    isUser ? 'blue.500' : 'gray.100',
    isUser ? 'blue.400' : 'gray.700'
  );
  const color = useColorModeValue(
    isUser ? 'white' : 'gray.900',
    isUser ? 'white' : 'gray.100'
  );
  const timeColor = useColorModeValue('gray.500', 'gray.400');

  const isPongCommand = message.role === 'user' && message.content.trim().toLowerCase() === '/pong';
  const isPongResponse = message.role === 'assistant' && message.content.includes('Click this message to start playing Pong!');
  const isClickablePong = isPongCommand || isPongResponse;

  const isContactPrompt = message.role === 'assistant' && (
    message.content.includes("Let's help you get in touch with Jonathan") ||
    message.content.includes("I'll help you send a message to Jonathan")
  );
  
  const handleContactSubmit = async (formData: { name?: string; email: string; message: string }) => {
    const formattedMessage = `
Name: ${formData.name || 'Anonymous'}
Email: ${formData.email}
Message: ${formData.message}
    `.trim();
    
    await sendMessage(formattedMessage);
  };

  return (
    <>
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
          {!isUser && <Avatar role={message.role} size="sm" />}
          <MotionBox
            maxW={{ base: '85%', md: '70%' }}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <Box
              bg={bg}
              color={color}
              px={{ base: 3, md: 4 }}
              py={{ base: 1.5, md: 2 }}
              borderRadius="xl"
              borderTopLeftRadius={!isUser ? 'sm' : undefined}
              borderTopRightRadius={isUser ? 'sm' : undefined}
              onClick={isClickablePong ? onOpen : undefined}
              cursor={isClickablePong ? 'pointer' : 'default'}
              _hover={isClickablePong ? {
                opacity: 0.9,
                transform: 'scale(1.02)',
              } : undefined}
              transition="all 0.2s"
            >
              <ReactMarkdown
                components={{
                  p: ({ children }) => <Text fontSize={{ base: "sm", md: "md" }} mb={2}>{children}</Text>,
                  a: ({ href, children }) => (
                    <Text
                      as="a"
                      href={href}
                      color={isUser ? 'white' : 'blue.500'}
                      textDecoration="underline"
                      target="_blank"
                      rel="noopener noreferrer"
                      fontSize={{ base: "sm", md: "md" }}
                    >
                      {children}
                    </Text>
                  ),
                  code: ({ children }) => (
                    <CodeBlock isUser={isUser}>{children as string}</CodeBlock>
                  ),
                  ol: ({ children }) => (
                    <Box as="ol" pl={{ base: 6, md: 8 }} mb={4}>
                      {children}
                    </Box>
                  ),
                  ul: ({ children }) => (
                    <Box as="ul" pl={{ base: 6, md: 8 }} mb={4}>
                      {children}
                    </Box>
                  ),
                  li: ({ children }) => (
                    <Text as="li" mb={3} fontSize={{ base: "sm", md: "md" }} sx={{
                      '&::marker': {
                        color: isUser ? 'white' : 'inherit',
                      }
                    }}>
                      {children}
                    </Text>
                  ),
                }}
              >
                {message.content}
              </ReactMarkdown>
              {isContactPrompt && (
                <Box mt={4}>
                  <ContactForm 
                    onSubmit={handleContactSubmit}
                    onCancel={() => sendMessage('cancel')}
                  />
                </Box>
              )}
            </Box>
          </MotionBox>
          {isUser && <Avatar role={message.role} size="sm" />}
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

      <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
        <ModalOverlay />
        <ModalContent bg="gray.900" maxW="fit-content">
          <ModalHeader color="white">Pong Game</ModalHeader>
          <ModalCloseButton color="white" />
          <ModalBody pb={6}>
            <Pong width={600} height={400} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}); 