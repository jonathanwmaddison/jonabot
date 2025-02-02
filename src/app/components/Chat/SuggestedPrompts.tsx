import { HStack, Button, useColorModeValue } from '@chakra-ui/react';

interface SuggestedPromptsProps {
  onPromptClick: (prompt: string) => void;
  matrixMode?: boolean;
}

const SUGGESTED_PROMPTS = [
  { text: "Jonathan's resume", prompt: "Can you show me Jonathan's resume?" },
  { text: "Work experience", prompt: "What is Jonathan's work experience?" },
  { text: "Technical skills", prompt: "What are Jonathan's technical skills?" },
  { text: "Education", prompt: "What is Jonathan's educational background?" },
  { text: "❓ Help", prompt: "/help" },
];

export function SuggestedPrompts({ onPromptClick, matrixMode = false }: SuggestedPromptsProps) {
  // Move hooks to top level
  const lightModeBg = useColorModeValue('gray.100', 'gray.700');
  const lightModeHoverBg = useColorModeValue('gray.200', 'gray.600');
  
  const buttonBg = matrixMode ? 'black' : lightModeBg;
  const buttonHoverBg = matrixMode ? '#003300' : lightModeHoverBg;
  const buttonColor = matrixMode ? '#00FF00' : undefined;
  const buttonBorder = matrixMode ? '1px solid #00FF00' : undefined;

  return (
    <HStack spacing={2} py={2} px={4} overflowX="auto" css={{
      '&::-webkit-scrollbar': { height: '4px' },
      '&::-webkit-scrollbar-track': { background: 'transparent' },
      '&::-webkit-scrollbar-thumb': { background: matrixMode ? '#00FF00' : 'gray.200' },
    }}>
      {SUGGESTED_PROMPTS.map((item) => (
        <Button
          key={item.text}
          size="sm"
          bg={buttonBg}
          color={buttonColor}
          border={buttonBorder}
          _hover={{ bg: buttonHoverBg }}
          onClick={() => onPromptClick(item.prompt)}
          flexShrink={0}
        >
          {item.text}
        </Button>
      ))}
    </HStack>
  );
} 