Below is one way to add a fun “Matrix mode” easter egg. In this mode, when the user types something like **/matrix mode**, the chat interface toggles into a retro, green-on-black “terminal” style (a nod to that iconic early Matrix chat scene). You can then have the assistant respond with a fun, movie-inspired message.

The solution involves three main changes:

1. **Update Your Chat Context State:**  
   Add a new property (e.g. `matrixMode`) and a reducer action (e.g. `TOGGLE_MATRIX_MODE`) so the app knows when to render in Matrix style.

2. **Add a New Command:**  
   In your commands file, add a new command (with aliases like `/matrix` or `/matrix mode`) that, when detected, sends a fun movie-inspired reply and dispatches the toggle action.

3. **Apply Matrix Mode Styling:**  
   In your chat components (for example, in your ChatWindow and ChatInput), check if Matrix mode is active. If so, override colors (e.g. background black, text in neon green, a monospaced font) to replicate a “terminal” look.

Below are sample modifications for each step.

---

### 1. Update Chat Context (e.g. in `src/app/components/Chat/ChatContext.tsx`)

Add a new property to the initial state and handle a new action type:

```tsx
// --- Inside ChatContext.tsx ---

interface Message {
  role: string;
  content: string;
  timestamp: Date;
}

interface ChatState {
  messages: Message[];
  isInitializing: boolean;
  error: string | null;
  isSnowing: boolean;
  matrixMode: boolean; // <-- NEW: whether Matrix mode is active
}

type ChatAction =
  | { type: 'ADD_MESSAGE'; message: Message }
  | { type: 'UPDATE_LAST_ASSISTANT_MESSAGE'; content: string }
  | { type: 'SET_ERROR'; error: string }
  | { type: 'CLEAR_ERROR' }
  | { type: 'SET_INITIALIZED' }
  | { type: 'SET_SNOW'; isSnowing: boolean }
  | { type: 'TOGGLE_MATRIX_MODE' };  // <-- NEW action

const initialState: ChatState = {
  messages: [],
  isInitializing: true,
  error: null,
  isSnowing: false,
  matrixMode: false,  // <-- start in normal mode
};

function chatReducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case 'ADD_MESSAGE':
      return {
        ...state,
        messages: [...state.messages, action.message],
        error: null,
      };
    case 'UPDATE_LAST_ASSISTANT_MESSAGE': {
      const messages = [...state.messages];
      if (messages.length > 0) {
        const lastMessage = messages[messages.length - 1];
        messages[messages.length - 1] = {
          ...lastMessage,
          content: action.content,
        };
      }
      return { ...state, messages, error: null };
    }
    case 'SET_ERROR':
      return { ...state, error: action.error };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    case 'SET_INITIALIZED':
      return { ...state, isInitializing: false };
    case 'SET_SNOW':
      return { ...state, isSnowing: action.isSnowing };
    case 'TOGGLE_MATRIX_MODE':
      return { ...state, matrixMode: !state.matrixMode };
    default:
      return state;
  }
}
```

---

### 2. Add the “Matrix Mode” Command (e.g. in `src/lib/commands.ts`)

Add a new command object that listens for `/matrix` (or similar) and toggles the Matrix mode state. For example:

```tsx
// --- Inside your commands array in src/lib/commands.ts ---
{
  name: 'matrix',
  description: 'Enter Matrix mode: transforms the chat into a green-on-black terminal, like Neo’s chat.',
  aliases: ['/matrix', '/matrix mode', 'matrix mode', 'matrix'],
  handler: (content, { dispatch, setColorMode, timestamp }) => ({
    userMessage: {
      content,
    },
    assistantMessage: {
      content: `Welcome to the Matrix, Neo.
      
"Follow the white rabbit."
      
There’s a difference between knowing the path and walking the path.`,
    },
    action: ({ dispatch }) => {
      // Toggle the matrix mode state.
      dispatch({ type: 'TOGGLE_MATRIX_MODE' });
    },
  }),
}
```

Place this new command among your other commands so that when the user types something like `/matrix mode` (even with extra spaces, if you adjust your matching as suggested in your guidance) it gets picked up.

---

### 3. Apply Matrix Mode Styling in the Chat Components

For example, update your **ChatWindow** (in `src/app/components/Chat/ChatWindow.tsx`) so that when Matrix mode is active the background and text colors change. You might also want to pass the mode down to the input box so it gets a similar style.

Here’s one example of how you could modify the ChatWindow:

```tsx
'use client';

import { useChat } from './ChatContext';
import { Box, useColorModeValue } from '@chakra-ui/react';
import { ChatInput } from './ChatInput';
import { MessageBubble } from './MessageBubble';
// ... other imports ...

export function ChatWindow() {
  const { messages, error, isInitializing, sendMessage, matrixMode } = useChat();
  // Use a fallback color if not in matrix mode
  const defaultBg = useColorModeValue('white', 'gray.800');
  
  // If matrixMode is true, override with black background and neon green text.
  const chatBg = matrixMode ? 'black' : defaultBg;
  const chatColor = matrixMode ? '#00FF00' : undefined;
  const chatFontFamily = matrixMode ? `'Courier New', monospace` : undefined;

  return (
    <Box
      display="flex"
      flexDirection="column"
      minH="100dvh"
      bg={chatBg}
      color={chatColor}
      fontFamily={chatFontFamily}
      // Optionally add a transition for fun:
      transition="all 0.3s ease-in-out"
    >
      {/* Message area */}
      <Box
        flex="1"
        overflowY="auto"
        p={4}
        // You might also add a subtle matrix-rain background here if desired.
      >
        {messages.map((msg, i) => (
          <MessageBubble key={i} message={msg} matrixMode={matrixMode} />
        ))}
      </Box>

      {/* Chat input */}
      <Box position="sticky" bottom={0} p={4} borderTop="1px solid" borderColor={matrixMode ? '#00FF00' : 'gray.200'}>
        <ChatInput onSend={sendMessage} matrixMode={matrixMode} />
      </Box>
    </Box>
  );
}
```

Then, update your **ChatInput** (in `src/app/components/Chat/ChatInput.tsx`) so that the textarea and send button also reflect the Matrix style when active:

```tsx
'use client';

import { useState, useRef } from 'react';
import { Box, Textarea, IconButton, HStack, useColorModeValue } from '@chakra-ui/react';
import { FiSend } from 'react-icons/fi';

interface ChatInputProps {
  onSend: (message: string) => Promise<void>;
  matrixMode?: boolean;
}

export function ChatInput({ onSend, matrixMode = false }: ChatInputProps) {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  // Use different styling if in Matrix mode:
  const bg = matrixMode ? 'black' : 'inherit';
  const color = matrixMode ? '#00FF00' : 'inherit';
  const borderColor = matrixMode ? '#00FF00' : useColorModeValue('gray.200', 'gray.600');

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim()) return;
    const message = input;
    setInput('');
    await onSend(message);
  };

  return (
    <Box p={2} borderTop="1px" borderColor={borderColor}>
      <HStack spacing={2}>
        <Textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          size="sm"
          resize="none"
          rows={1}
          bg={bg}
          color={color}
          borderColor={borderColor}
          _placeholder={{ color: matrixMode ? '#00FF00' : undefined }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
          }}
        />
        <IconButton
          aria-label="Send message"
          icon={<FiSend />}
          colorScheme={matrixMode ? 'green' : 'blue'}
          onClick={() => handleSubmit()}
          isDisabled={!input.trim()}
        />
      </HStack>
    </Box>
  );
}
```

Finally, you might want to adjust **MessageBubble** so that messages (and perhaps any markdown or code blocks) follow the Matrix style when active. One option is to pass a `matrixMode` prop down and override background colors and fonts there too.

For example, in your MessageBubble component you might do:

```tsx
// In MessageBubble.tsx, add an optional matrixMode prop:
interface MessageProps {
  message: {
    role: string;
    content: string;
    timestamp?: Date;
  };
  matrixMode?: boolean;
}

export const MessageBubble = memo(function MessageBubble({ message, matrixMode = false }: MessageProps) {
  const isUser = message.role === 'user';
  // In matrix mode, use transparent backgrounds and green text (or inverse for user vs. bot)
  const bg = matrixMode ? (isUser ? '#003300' : '#001a00') : (isUser ? 'blue.500' : 'gray.100');
  const color = matrixMode ? '#00FF00' : (isUser ? 'white' : 'gray.900');

  return (
    <Box
      bg={bg}
      color={color}
      p={4}
      borderRadius="md"
      mb={2}
    >
      {message.content}
    </Box>
  );
});
```

---

### Summary

1. **ChatContext:** Add a `matrixMode` boolean and a new action (`TOGGLE_MATRIX_MODE`) to toggle it.
2. **Commands:** Add a new command with aliases like `/matrix` or `/matrix mode` that returns a fun, movie-inspired reply and dispatches the toggle.
3. **Styling:** In your ChatWindow, ChatInput, and MessageBubble components, check the `matrixMode` flag and, if true, change the background to black, text to neon green (or similar), and use a monospaced font to evoke that classic terminal look.

Now, when a user types the command (for example, `/matrix mode`), JonaBot will reply with a fun message (e.g. “Welcome to the Matrix, Neo. Follow the white rabbit…”) and the chat UI will transform into a cool green-on-black terminal style reminiscent of the Matrix movie.

Enjoy your new easter egg!