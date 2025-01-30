import { Inter } from 'next/font/google';
import { ChakraProvider } from '@chakra-ui/react';
import "./globals.css";
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'JonaBot - Your Personal AI Assistant',
  description: 'Chat with JonaBot to learn more about Jonathan and his work.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <ChakraProvider>
            {children}
          </ChakraProvider>
        </Providers>
      </body>
    </html>
  );
}
