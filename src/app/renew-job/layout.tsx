import { Metadata } from 'next';
import { Inter, Work_Sans } from 'next/font/google';
import './styles.css';

// Load Inter font
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

// Load Work Sans font
const workSans = Work_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-work-sans',
});

export const metadata: Metadata = {
  title: 'Renew Job Application Assistant',
  description: 'AI assistant to help with your Renew Home Staff Software Engineer application',
};

export default function RenewJobLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${inter.variable} ${workSans.variable}`}>
      {children}
    </div>
  );
} 