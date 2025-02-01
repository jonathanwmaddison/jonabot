interface CommandFunction {
  name: string;
  arguments: Record<string, any>;
}

export const handleCommand = async (functionCall: CommandFunction) => {
  switch (functionCall.name) {
    case 'switchColorMode':
      // Dispatch color mode change event
      const event = new CustomEvent('colorModeChange', {
        detail: { mode: functionCall.arguments.mode }
      });
      window.dispatchEvent(event);
      return true;

    case 'toggleSnow':
      // Dispatch snow toggle event
      window.dispatchEvent(new CustomEvent('toggleSnow'));
      return true;

    case 'startPongGame':
      // Dispatch pong game start event
      window.dispatchEvent(new CustomEvent('startPongGame'));
      return true;

    case 'prepareContactMessage':
      // Dispatch contact form event with the structured data
      const contactEvent = new CustomEvent('prepareContact', {
        detail: {
          name: functionCall.arguments.name || '',
          email: functionCall.arguments.email,
          message: functionCall.arguments.message
        }
      });
      window.dispatchEvent(contactEvent);
      return true;

    default:
      console.warn(`Unknown command: ${functionCall.name}`);
      return false;
  }
}; 