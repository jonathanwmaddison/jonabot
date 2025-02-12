import { HStack, Button, useColorModeValue } from '@chakra-ui/react';

interface SuggestedPromptsProps {
  onPromptClick: (prompt: string) => void;
  matrixMode?: boolean;
  isDisabled?: boolean;
  customPrompts?: Array<{ text: string; prompt: string; }>;
}

const DEFAULT_PROMPTS = [
  { 
    text: "AI Work Experience", 
    prompt: "Tell me about Jonathan's experience building AI-integrated applications at Paige and other companies?" 
  },
  { 
    text: "Frontend Leadership", 
    prompt: "What frontend architecture and team leadership experience does Jonathan have from his Staff Engineer role?" 
  },
  { 
    text: "Complex UI Systems", 
    prompt: "Can you describe Jonathan's experience building complex UI systems like the digital pathology viewer at Paige?" 
  },
  { 
    text: "Tech Leadership", 
    prompt: "How has Jonathan led technical initiatives and mentored teams in his professional roles?" 
  },
  { 
    text: "Modern Stack", 
    prompt: "What's Jonathan's experience with modern web technologies like React, TypeScript, and microfrontends?" 
  },
  { 
    text: "❓ Help", 
    prompt: "/help" 
  },
];

export function SuggestedPrompts({ 
  onPromptClick, 
  matrixMode = false, 
  isDisabled = false,
  customPrompts
}: SuggestedPromptsProps) {
  // Move hooks to top level
  const lightModeBg = useColorModeValue('gray.100', 'gray.700');
  const lightModeHoverBg = useColorModeValue('gray.200', 'gray.600');
  
  const buttonBg = matrixMode ? 'black' : lightModeBg;
  const buttonHoverBg = matrixMode ? '#003300' : lightModeHoverBg;
  const buttonColor = matrixMode ? '#00FF00' : undefined;
  const buttonBorder = matrixMode ? '1px solid #00FF00' : undefined;

  const activePrompts = customPrompts || DEFAULT_PROMPTS;

  return (
    <HStack spacing={2} py={2} px={4} overflowX="auto" css={{
      '&::-webkit-scrollbar': { height: '4px' },
      '&::-webkit-scrollbar-track': { background: 'transparent' },
      '&::-webkit-scrollbar-thumb': { background: matrixMode ? '#00FF00' : 'gray.200' },
    }}>
      {activePrompts.map((item) => (
        <Button
          key={item.text}
          size="sm"
          bg={buttonBg}
          color={buttonColor}
          border={buttonBorder}
          _hover={{ bg: !isDisabled ? buttonHoverBg : buttonBg }}
          onClick={() => !isDisabled && onPromptClick(item.prompt)}
          flexShrink={0}
          opacity={isDisabled ? 0.7 : 1}
          cursor={isDisabled ? 'not-allowed' : 'pointer'}
          _disabled={{ opacity: 0.7 }}
          isDisabled={isDisabled}
        >
          {item.text}
        </Button>
      ))}
    </HStack>
  );
} 