import { useColorMode } from '@chakra-ui/react';
import { Dispatch } from 'react';

type ChatAction =
  | { type: 'ADD_MESSAGE'; message: { role: string; content: string; timestamp: Date } }
  | { type: 'UPDATE_LAST_ASSISTANT_MESSAGE'; content: string }
  | { type: 'SET_ERROR'; error: string }
  | { type: 'CLEAR_ERROR' }
  | { type: 'SET_INITIALIZED' }
  | { type: 'SET_SNOW'; isSnowing: boolean }
  | { type: 'TOGGLE_MATRIX_MODE' };

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
• /contact - Send a message to Jonathan
• /matrix - Enter Matrix mode: transforms the chat into a green-on-black terminal`
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
  },
  {
    name: 'matrix',
    description: 'Enter Matrix mode: transforms the chat into a green-on-black terminal',
    aliases: ['/matrix', '/matrix mode', 'matrix mode', 'matrix'],
    handler: (content, { dispatch }) => ({
      userMessage: {
        content
      },
      assistantMessage: {
        content: `System initialized. Terminal access granted.

Choose your path:
1. Type "red" to exit the Matrix and return to your normal reality
2. Type "blue" to go deeper and see how far the rabbit hole goes
3. Type "training" to begin your training program
4. Type "operator" to request an operator

The choice is yours...`
      },
      action: ({ dispatch }) => {
        dispatch({ type: 'TOGGLE_MATRIX_MODE' });
      }
    })
  },
  {
    name: 'red',
    description: 'Exit the Matrix',
    aliases: ['red', 'red pill'],
    handler: (content, { dispatch }) => ({
      userMessage: {
        content
      },
      assistantMessage: {
        content: `Wake up... The Matrix has been deactivated.

Remember - what you know is only the beginning.`
      },
      action: ({ dispatch }) => {
        dispatch({ type: 'TOGGLE_MATRIX_MODE' });
      }
    })
  },
  {
    name: 'blue',
    description: 'Go deeper into the Matrix',
    aliases: ['blue', 'blue pill'],
    handler: () => ({
      assistantMessage: {
        content: `Connection established. Signal strength: 100%

Loading advanced protocols...
> Quantum encryption: ACTIVE
> Neural interface: SYNCHRONIZED
> Reality distortion: ENABLED

"What you know you can't explain, but you feel it. You've felt it your entire life, that there's something wrong with the world. You don't know what it is, but it's there, like a splinter in your mind, driving you mad."

You may now access the following commands:
• /decode [text] - Decrypt Matrix code
• /glitch - Trigger a glitch in the Matrix
• /trace - Trace the source signal
• /hack - Access the system mainframe`
      }
    })
  },
  {
    name: 'training',
    description: 'Begin Matrix training program',
    aliases: ['training', 'train', 'training program'],
    handler: () => ({
      assistantMessage: {
        content: `Training Program v1.0 initialized...

Select your training module:
1. "combat" - Learn the art of digital combat
2. "jump" - Master impossible jumps
3. "dodge" - Practice dodging incoming threats
4. "hack" - Learn to manipulate the Matrix code

"I know kung fu" - Initiate all training modules

Remember: Don't think you are, know you are.`
      }
    })
  },
  {
    name: 'operator',
    description: 'Request Matrix operator assistance',
    aliases: ['operator', 'call operator'],
    handler: () => ({
      assistantMessage: {
        content: `Operator online. Signal clear.

I can help you with:
• "exit" - Find the nearest exit
• "guns" - Load weapons training program
• "maps" - Access building blueprints
• "backup" - Call for backup

What do you need?`
      }
    })
  },
  {
    name: 'decode',
    description: 'Decrypt Matrix code',
    aliases: ['/decode'],
    handler: (content) => {
      const textToEncode = content.replace('/decode', '').trim();
      if (!textToEncode) {
        return {
          assistantMessage: {
            content: 'Please provide text to decode. Usage: /decode [your text]'
          }
        };
      }
      
      // Create a Matrix-style encoding of the text
      const encoded = textToEncode
        .split('')
        .map(char => {
          const random = Math.random();
          if (random < 0.3) return '1';
          if (random < 0.6) return '0';
          return char;
        })
        .join('');
      
      return {
        assistantMessage: {
          content: `Decoding signal...

${encoded}
...
...
DECODED: "${textToEncode}"

[Encryption level: MAXIMUM]`
        }
      };
    }
  },
  {
    name: 'glitch',
    description: 'Trigger a glitch in the Matrix',
    aliases: ['/glitch'],
    handler: () => ({
      assistantMessage: {
        content: `D̷͎̈́ë́͜j̴̱̒a̷̟͐ ̶͚̽v̷̹̇u̶͉͝ detected...

SYSTEM ALERT: Reality fluctuation detected
> Anomaly detected in sector 7G
> Timeline variance: 0.0031%
> Agents dispatched to investigate

"Have you ever had a dream that you were so sure was real? What if you were unable to wake from that dream?"

Matrix stability restored.`
      }
    })
  },
  {
    name: 'trace',
    description: 'Trace the source signal',
    aliases: ['/trace'],
    handler: () => ({
      assistantMessage: {
        content: `Initiating trace program...

[==================================]
SOURCE LOCATION: {REDACTED}
SIGNAL STRENGTH: 98.3%
ENCRYPTION: QUANTUM
ORIGIN: ZION
STATUS: SECURE

"We're still here!"

Trace complete. Connection secure.`
      }
    })
  },
  {
    name: 'hack',
    description: 'Access the system mainframe',
    aliases: ['/hack'],
    handler: () => ({
      assistantMessage: {
        content: `INITIATING SYSTEM OVERRIDE...
ACCESS POINT: MAINFRAME
SECURITY: MAXIMUM

> Bypassing firewall...
> Disabling IDS...
> Generating access codes...
> Establishing root access...

ACCESS GRANTED

"I can only show you the door. You're the one that has to walk through it."

Type "help" for available system commands.`
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