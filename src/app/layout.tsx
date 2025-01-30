import { Inter } from 'next/font/google';
import { ChakraProvider } from '@chakra-ui/react';
import "./globals.css";

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'JonaBot - Personal AI Assistant',
  description: 'An AI assistant powered by OpenAI to help answer questions about Jonathan.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ChakraProvider>
          {children}
        </ChakraProvider>
      </body>
    </html>
  );
}
