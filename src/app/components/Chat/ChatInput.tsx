'use client';

import { useState, useRef, KeyboardEvent, useEffect } from 'react';
import {
  Box,
  Textarea,
  IconButton,
  HStack,
  useColorModeValue,
  Spinner,
  InputGroup,
  InputRightElement,
  Button,
} from '@chakra-ui/react';
import { FiSend } from 'react-icons/fi';
import { useChat } from './ChatContext';
import { CommandSuggestions } from './CommandSuggestions';
import { AnimatePresence } from 'framer-motion';

interface ChatInputProps {
  onSubmit: (message: string) => void;
  isDisabled?: boolean;
  matrixMode?: boolean;
}

export function ChatInput({ onSubmit, isDisabled, matrixMode = false }: ChatInputProps) {
  const [input, setInput] = useState('');
  const [showCommands, setShowCommands] = useState(false);
  const [selectedCommandIndex, setSelectedCommandIndex] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // Use matrix mode styling when active
  const borderColor = matrixMode ? '#00FF00' : useColorModeValue('gray.200', 'gray.600');
  const bg = matrixMode ? 'black' : undefined;
  const color = matrixMode ? '#00FF00' : undefined;
  const placeholderColor = matrixMode ? '#00FF00' : undefined;

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    const trimmedInput = input.trim();
    if (!trimmedInput || isDisabled) return;

    onSubmit(trimmedInput);
    setInput('');
    setShowCommands(false);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (showCommands) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedCommandIndex(prev => prev + 1);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedCommandIndex(prev => Math.max(0, prev - 1));
      } else if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        const commandElements = document.querySelectorAll('[data-command]');
        if (commandElements[selectedCommandIndex]) {
          const command = commandElements[selectedCommandIndex].getAttribute('data-command');
          if (command) {
            setInput(command);
            setShowCommands(false);
          }
        }
      } else if (e.key === 'Escape') {
        setShowCommands(false);
      }
    } else if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setInput(newValue);
    
    // Show commands when typing '/' at the start of input or after a newline
    if (newValue === '/' || /\n\/$/.test(newValue)) {
      setShowCommands(true);
      setSelectedCommandIndex(0);
    } else if (!newValue.endsWith('/')) {
      setShowCommands(false);
    }

    // Auto-resize
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
  };

  const handleCommandSelect = (command: string) => {
    setInput(command);
    setShowCommands(false);
    textareaRef.current?.focus();
  };

  return (
    <Box p={4} borderTop="1px" borderColor={borderColor}>
      <Box position="relative">
        <AnimatePresence>
          <CommandSuggestions
            isOpen={showCommands}
            filter={input.slice(input.lastIndexOf('/') + 1)}
            onSelect={handleCommandSelect}
            selectedIndex={selectedCommandIndex}
            matrixMode={matrixMode}
          />
        </AnimatePresence>
        <HStack spacing={2}>
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={isDisabled ? 'Sending message...' : 'Type your message...'}
            size="sm"
            resize="none"
            rows={1}
            minH={{ base: "44px", md: "40px" }}
            maxH={{ base: "160px", md: "200px" }}
            overflowY="auto"
            disabled={isDisabled}
            bg={bg}
            color={color}
            borderColor={borderColor}
            _placeholder={{ color: placeholderColor }}
            _focus={{
              borderColor: matrixMode ? '#00FF00' : 'blue.500',
              boxShadow: 'none',
            }}
            sx={{
              // Improve touch handling on mobile
              '@media (hover: none)': {
                fontSize: '16px', // Prevent iOS zoom
              }
            }}
          />
          <IconButton
            aria-label="Send message"
            icon={isDisabled ? <Spinner size="sm" /> : <FiSend />}
            colorScheme={matrixMode ? 'green' : 'blue'}
            onClick={() => handleSubmit()}
            isDisabled={!input.trim() || isDisabled}
            size={{ base: "md", md: "sm" }}
            minW={{ base: "44px", md: "32px" }}
            height={{ base: "44px", md: "32px" }}
            bg={matrixMode ? 'black' : undefined}
            color={matrixMode ? '#00FF00' : undefined}
            borderColor={matrixMode ? '#00FF00' : undefined}
            _hover={matrixMode ? {
              bg: '#003300'
            } : undefined}
          />
        </HStack>
      </Box>
    </Box>
  );
} 