import { HStack, Button, useColorModeValue } from '@chakra-ui/react';

interface SuggestedPromptsProps {
  onPromptClick: (prompt: string) => void;
}

const SUGGESTED_PROMPTS = [
  { text: "Get Jonathan's resume", prompt: "Can you show me Jonathan's resume?" },
  { text: "Work experience", prompt: "What is Jonathan's work experience?" },
  { text: "Technical skills", prompt: "What are Jonathan's technical skills?" },
  { text: "Education", prompt: "What is Jonathan's educational background?" },
  { text: "🌙 Dark mode", prompt: "switch to dark mode" },
  { text: "☀️ Light mode", prompt: "switch to light mode" },
  { text: "❄️ Make it snow", prompt: "make it snow" },
];

export function SuggestedPrompts({ onPromptClick }: SuggestedPromptsProps) {
  const buttonBg = useColorModeValue('gray.100', 'gray.700');
  const buttonHoverBg = useColorModeValue('gray.200', 'gray.600');

  return (
    <HStack spacing={2} py={2} px={4} overflowX="auto" css={{
      '&::-webkit-scrollbar': { height: '4px' },
      '&::-webkit-scrollbar-track': { background: 'transparent' },
      '&::-webkit-scrollbar-thumb': { background: 'gray.200' },
    }}>
      {SUGGESTED_PROMPTS.map((item) => (
        <Button
          key={item.text}
          size="sm"
          bg={buttonBg}
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