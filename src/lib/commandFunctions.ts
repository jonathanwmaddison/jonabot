export const commandFunctions = [
  {
    name: "switchColorMode",
    description: "Switch the UI color mode to dark or light.",
    parameters: {
      type: "object",
      properties: {
        mode: {
          type: "string",
          enum: ["dark", "light"],
          description: "The target color mode.",
        }
      },
      required: ["mode"],
    },
  },
  {
    name: "toggleSnow",
    description: "Toggle the snow effect on the UI.",
    parameters: {
      type: "object",
      properties: {},
    },
  },
  {
    name: "startPongGame",
    description: "Start a game of Pong.",
    parameters: {
      type: "object",
      properties: {},
    },
  },
  {
    name: "prepareContactMessage",
    description: "Structure a contact message.",
    parameters: {
      type: "object",
      properties: {
        name: { 
          type: "string", 
          description: "The sender's name." 
        },
        email: { 
          type: "string", 
          description: "The sender's email address." 
        },
        message: { 
          type: "string", 
          description: "The message body." 
        },
      },
      required: ["email", "message"],
    },
  },
]; 