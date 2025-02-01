'use client';

import { useState } from 'react';
import {
  VStack,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  useToast,
  FormErrorMessage,
  Box,
  Text,
} from '@chakra-ui/react';

interface ContactFormProps {
  onSubmit: (formData: { name?: string; email: string; message: string }) => Promise<void>;
  onCancel: () => void;
}

export function ContactForm({ onSubmit, onCancel }: ContactFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; message?: string }>({});
  const toast = useToast();

  const validateForm = () => {
    const newErrors: { email?: string; message?: string } = {};
    
    // Validate email
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/;
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(email)) {
      newErrors.email = 'Invalid email format';
    }

    // Validate message
    if (!message) {
      newErrors.message = 'Message is required';
    } else if (message.length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    } else if (message.length > 1000) {
      newErrors.message = 'Message must be less than 1000 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({ name: name || undefined, email, message });
      toast({
        title: 'Message sent successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error sending message',
        description: error instanceof Error ? error.message : 'Please try again later',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box 
      borderRadius="lg" 
      bg="whiteAlpha.50"
      _dark={{ bg: 'blackAlpha.300' }}
    >
      <form onSubmit={handleSubmit}>
        <VStack spacing={4} align="stretch">
          <FormControl>
            <FormLabel fontSize="sm" mb={1}>Name (optional)</FormLabel>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              size="sm"
              bg="whiteAlpha.900"
              _dark={{ bg: 'whiteAlpha.200' }}
              _placeholder={{ color: 'gray.400' }}
              borderRadius="md"
            />
          </FormControl>

          <FormControl isInvalid={!!errors.email} isRequired>
            <FormLabel fontSize="sm" mb={1}>Email</FormLabel>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@example.com"
              type="email"
              size="sm"
              bg="whiteAlpha.900"
              _dark={{ bg: 'whiteAlpha.200' }}
              _placeholder={{ color: 'gray.400' }}
              borderRadius="md"
            />
            <FormErrorMessage fontSize="xs">{errors.email}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.message} isRequired>
            <FormLabel fontSize="sm" mb={1}>Message</FormLabel>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Your message here..."
              size="sm"
              minH="80px"
              bg="whiteAlpha.900"
              _dark={{ bg: 'whiteAlpha.200' }}
              _placeholder={{ color: 'gray.400' }}
              borderRadius="md"
              resize="vertical"
            />
            <FormErrorMessage fontSize="xs">{errors.message}</FormErrorMessage>
          </FormControl>

          <Box display="flex" gap={2} justifyContent="flex-end">
            <Button
              size="sm"
              variant="ghost"
              onClick={onCancel}
              isDisabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              type="submit"
              colorScheme="blue"
              isLoading={isSubmitting}
              loadingText="Sending..."
            >
              Send Message
            </Button>
          </Box>
        </VStack>
      </form>
    </Box>
  );
} 