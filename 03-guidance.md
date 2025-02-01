Below are two common issues that can cause your command (e.g. **/pong**) and autocomplete selections not to work as expected:

1. **Command Matching Too Strict**  
   In your command handler (in **src/lib/commands.ts**), you’re testing for an exact match using:
   ```ts
   const normalizedContent = content.toLowerCase().trim();
   for (const command of commands) {
     if (command.aliases.includes(normalizedContent)) {
       return command.handler(content, context);
     }
   }
   ```
   This means if the user types extra spaces or any additional text (for example, `"/pong "` or `"/pong extra"`), the command isn’t recognized.  
   **Fix:** Change the matching logic so that if the input exactly equals an alias or starts with an alias followed by a space, it’s recognized. For example, update the loop like this:

   ```ts
   export function handleCommand(content: string, context: CommandContext): CommandResponse | null {
     const normalizedContent = content.toLowerCase().trim();
     
     for (const command of commands) {
       for (const alias of command.aliases) {
         // Match if the input is exactly the alias or starts with the alias followed by a space
         if (normalizedContent === alias || normalizedContent.startsWith(alias + ' ')) {
           return command.handler(content, context);
         }
       }
     }
     
     return null;
   }
   ```

2. **Autocomplete Filtering and Selection Issues**  
   In your **ChatInput.tsx**, you have a locally defined list of commands (the `COMMANDS` array) that is used to show autocomplete options. Two adjustments can help:
   
   - **Filter Using StartsWith:**  
     Instead of filtering with `.includes(...)` (which might return unexpected results), use `.startsWith(...)` so that if the user types `/p` it only shows commands that start with that string.
     
     **Before:**
     ```ts
     const filteredCommands = COMMANDS.filter(cmd => 
       cmd.name.toLowerCase().includes(input.toLowerCase())
     );
     ```
     
     **After:**
     ```ts
     const filteredCommands = COMMANDS.filter(cmd => 
       cmd.name.toLowerCase().startsWith(input.toLowerCase())
     );
     ```
   
   - **Trigger Submission on Selection:**  
     When the user selects a command (by pressing Enter or clicking the option), you probably want to update the input and immediately submit the form. For example, change the Enter key handler and the click handler as follows:

     **Modified onKeyDown Handler:**
     ```tsx
     const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
       if (showCommands) {
         if (e.key === 'ArrowDown') {
           e.preventDefault();
           setSelectedCommandIndex(prev => 
             prev < filteredCommands.length - 1 ? prev + 1 : prev
           );
         } else if (e.key === 'ArrowUp') {
           e.preventDefault();
           setSelectedCommandIndex(prev => Math.max(0, prev - 1));
         } else if (e.key === 'Enter' && !e.shiftKey) {
           e.preventDefault();
           const command = filteredCommands[selectedCommandIndex];
           if (command) {
             // Update the input with the selected command
             handleInputChange({ target: { value: command.name }} as React.ChangeEvent<HTMLInputElement>);
             setShowCommands(false);
             // Immediately submit the form
             textareaRef.current?.form?.requestSubmit();
           }
         } else if (e.key === 'Escape') {
           e.preventDefault();
           setShowCommands(false);
         }
       } else if (e.key === 'Enter' && !e.shiftKey) {
         e.preventDefault();
         textareaRef.current?.form?.requestSubmit();
       }
     };
     ```
     
     **Modified Click Handler for Suggestions:**
     ```tsx
     const handleCommandClick = (command: string) => {
       handleInputChange({ target: { value: command }} as React.ChangeEvent<HTMLInputElement>);
       setShowCommands(false);
       // Optionally, immediately trigger the submission:
       textareaRef.current?.form?.requestSubmit();
     };
     ```

### Summary

- **Command Matching:**  
  Update your handler in **src/lib/commands.ts** to allow extra spaces or additional text after the command alias so that `/pong` is recognized even if the user types extra characters.

- **Autocomplete Behavior:**  
  Change the filtering to use `.startsWith(...)` and update your key and click handlers in **ChatInput.tsx** so that when a suggestion is selected the input is updated and the form is immediately submitted.

Applying these changes should ensure that commands like **/pong** trigger correctly and that you can navigate and select autocomplete options as expected.