import { Box, VStack, Text, useColorModeValue } from '@chakra-ui/react';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

interface Command {
  name: string;
  description: string;
}

const COMMANDS: Command[] = [
  { name: '/help', description: 'Show available commands' },
  { name: '/contact', description: 'Contact Jonathan' },
  { name: '/pong', description: 'Play a game of Pong' },
  { name: '/dark', description: 'Switch to dark mode' },
  { name: '/light', description: 'Switch to light mode' },
  { name: '/snow', description: 'Toggle snow effect' },
];

interface CommandSuggestionsProps {
  isOpen: boolean;
  filter: string;
  onSelect: (command: string) => void;
  selectedIndex: number;
}

export function CommandSuggestions({ isOpen, filter, onSelect, selectedIndex }: CommandSuggestionsProps) {
  const bg = useColorModeValue('white', 'gray.800');
  const hoverBg = useColorModeValue('gray.50', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const selectedBg = useColorModeValue('blue.50', 'blue.900');

  const filteredCommands = COMMANDS.filter(cmd => 
    cmd.name.toLowerCase().includes(filter.toLowerCase())
  );

  if (!isOpen || filteredCommands.length === 0) return null;

  return (
    <MotionBox
      position="absolute"
      bottom="100%"
      left={0}
      right={0}
      mb={2}
      borderRadius="md"
      border="1px solid"
      borderColor={borderColor}
      bg={bg}
      boxShadow="lg"
      maxH="200px"
      overflowY="auto"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.2 }}
      zIndex={1000}
    >
      <VStack spacing={0} align="stretch">
        {filteredCommands.map((cmd, index) => (
          <Box
            key={cmd.name}
            px={4}
            py={2}
            cursor="pointer"
            bg={index === selectedIndex ? selectedBg : undefined}
            _hover={{ bg: index === selectedIndex ? selectedBg : hoverBg }}
            onClick={() => onSelect(cmd.name)}
          >
            <Text fontWeight="medium">{cmd.name}</Text>
            <Text fontSize="sm" color="gray.500">{cmd.description}</Text>
          </Box>
        ))}
      </VStack>
    </MotionBox>
  );
} 