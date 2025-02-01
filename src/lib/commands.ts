import { useColorMode } from '@chakra-ui/react';
import { Dispatch } from 'react';

type ChatAction =
  | { type: 'ADD_MESSAGE'; message: { role: string; content: string; timestamp: Date } }
  | { type: 'UPDATE_LAST_ASSISTANT_MESSAGE'; content: string }
  | { type: 'SET_ERROR'; error: string }
  | { type: 'CLEAR_ERROR' }
  | { type: 'SET_INITIALIZED' }
  | { type: 'SET_SNOW'; isSnowing: boolean };

export interface CommandContext {
  dispatch: Dispatch<ChatAction>;
  setColorMode: ReturnType<typeof useColorMode>['setColorMode'];
  timestamp: Date;
}

interface CommandResponse {
  userMessage?: {
    content: string;
  };
  assistantMessage?: {
    content: string;
  };
  action?: (context: CommandContext) => void;
}

type CommandHandler = (content: string, context: CommandContext) => CommandResponse;

interface Command {
  name: string;
  description: string;
  aliases: string[];
  handler: CommandHandler;
}

const commands: Command[] = [
  {
    name: 'help',
    description: 'Show available commands',
    aliases: ['/help', 'help', 'commands', '/commands'],
    handler: () => ({
      assistantMessage: {
        content: `Here are the available commands:

• /help - Show this help message
• /pong - Play a game of Pong
• /dark - Switch to dark mode
• /light - Switch to light mode
• /snow - Toggle snow effect
• /contact - Send a message to Jonathan`
      }
    })
  },
  {
    name: 'pong',
    description: 'Play Pong game',
    aliases: ['/pong'],
    handler: (content) => ({
      userMessage: {
        content
      },
      assistantMessage: {
        content: 'Click this message to start playing Pong! Use your mouse to control the left paddle. 🏓'
      }
    })
  },
  {
    name: 'dark',
    description: 'Switch to dark mode',
    aliases: ['/dark', 'dark mode', 'switch to dark mode', 'enable dark mode'],
    handler: (content, { setColorMode }) => ({
      userMessage: {
        content
      },
      assistantMessage: {
        content: 'I\'ve switched to dark mode for you! 🌙'
      },
      action: () => setColorMode('dark')
    })
  },
  {
    name: 'light',
    description: 'Switch to light mode',
    aliases: ['/light', 'light mode', 'switch to light mode', 'enable light mode'],
    handler: (content, { setColorMode }) => ({
      userMessage: {
        content
      },
      assistantMessage: {
        content: 'I\'ve switched to light mode for you! ☀️'
      },
      action: () => setColorMode('light')
    })
  },
  {
    name: 'snow',
    description: 'Toggle snow effect',
    aliases: ['/snow', 'make it snow', 'let it snow', 'snow', 'toggle snow'],
    handler: (content, { dispatch }) => ({
      userMessage: {
        content
      },
      assistantMessage: {
        content: 'Toggled the snow effect! ❄️'
      },
      action: ({ dispatch }) => {
        const state = document.documentElement.dataset.isSnowing === 'true';
        dispatch({ type: 'SET_SNOW', isSnowing: !state });
        document.documentElement.dataset.isSnowing = (!state).toString();
      }
    })
  },
  {
    name: 'contact',
    description: 'Send a message to Jonathan',
    aliases: ['/contact', 'contact', 'send message', 'send email', 'get in touch', 'reach out'],
    handler: (content) => ({
      userMessage: {
        content
      },
      assistantMessage: {
        content: "Let's help you get in touch with Jonathan!"
      }
    })
  }
];

export function handleCommand(content: string, context: CommandContext): CommandResponse | null {
  const normalizedContent = content.toLowerCase().trim();
  
  for (const command of commands) {
    if (command.aliases.includes(normalizedContent)) {
      return command.handler(content, context);
    }
  }
  
  return null;
} 