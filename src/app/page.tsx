import { ChatWindow } from './components/Chat/ChatWindow';
import { Box, Heading, Text, Container } from '@chakra-ui/react';

export default function Home() {
  return (
    <Box as="main" minH="100vh" py={8}>
      <Container maxW="4xl" mb={8}>
        <Heading as="h1" size="xl" mb={2} textAlign="center">
          Welcome to JonaBot
        </Heading>
        <Text textAlign="center" mb={8} color="gray.600">
          Your personal AI assistant to learn more about Jonathan and his work.
        </Text>
      </Container>
      <ChatWindow />
    </Box>
  );
}
