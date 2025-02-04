import { Box, VStack, Text, useColorModeValue } from '@chakra-ui/react';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

interface Command {
  name: string;
  description: string;
}

const DEFAULT_COMMANDS: Command[] = [
  { name: '/contact', description: 'Send a message to Jonathan' },
  { name: '/dark', description: 'Switch to dark mode' },
  { name: '/help', description: 'Show help message' },
  { name: '/light', description: 'Switch to light mode' },
  { name: '/matrix', description: 'Enter Matrix mode' },
  { name: '/pong', description: 'Play a game of Pong' },
  { name: '/snow', description: 'Toggle snow effect' },
];

interface CommandSuggestionsProps {
  isOpen: boolean;
  filter: string;
  onSelect: (command: string) => void;
  selectedIndex: number;
  matrixMode?: boolean;
  commands?: Command[];
}

export function CommandSuggestions({ 
  isOpen, 
  filter, 
  onSelect, 
  selectedIndex, 
  matrixMode = false,
  commands = DEFAULT_COMMANDS 
}: CommandSuggestionsProps) {
  // Move hooks to top level
  const lightModeBg = useColorModeValue('white', 'gray.800');
  const lightModeHoverBg = useColorModeValue('gray.50', 'gray.700');
  const lightModeBorderColor = useColorModeValue('gray.200', 'gray.600');
  const lightModeSelectedBg = useColorModeValue('blue.50', 'blue.900');
  
  const bg = matrixMode ? 'black' : lightModeBg;
  const hoverBg = matrixMode ? '#003300' : lightModeHoverBg;
  const borderColor = matrixMode ? '#00FF00' : lightModeBorderColor;
  const selectedBg = matrixMode ? '#004400' : lightModeSelectedBg;
  const textColor = matrixMode ? '#00FF00' : undefined;
  const descriptionColor = matrixMode ? '#00AA00' : 'gray.500';

  const filteredCommands = commands.filter(cmd => 
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
      color={textColor}
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
            color={textColor}
            _hover={{ bg: index === selectedIndex ? selectedBg : hoverBg }}
            onClick={() => onSelect(cmd.name)}
          >
            <Text fontWeight="medium">{cmd.name}</Text>
            <Text fontSize="sm" color={descriptionColor}>{cmd.description}</Text>
          </Box>
        ))}
      </VStack>
    </MotionBox>
  );
} 