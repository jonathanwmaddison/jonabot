import { Inter } from 'next/font/google';
import { ColorModeScript } from '@chakra-ui/react';
import "./globals.css";
import { Providers } from './providers';
import { themeConfig } from './theme.config';

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
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"
        />
        <ColorModeScript initialColorMode={themeConfig.initialColorMode} />
      </head>
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
