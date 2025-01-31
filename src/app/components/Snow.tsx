'use client';

import { Box, useColorModeValue } from '@chakra-ui/react';

export function Snow({ isActive = false }: { isActive?: boolean }) {
  const snowColor = useColorModeValue('rgba(148, 187, 233, 0.8)', 'rgba(255, 255, 255, 0.8)');
  
  if (!isActive) return null;

  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      right={0}
      bottom={0}
      pointerEvents="none"
      zIndex={1}
      sx={{
        '@keyframes snow': {
          '0%': {
            transform: 'translateY(-100vh)',
          },
          '100%': {
            transform: 'translateY(100vh)',
          }
        },
        '&::before, &::after': {
          content: '""',
          position: 'fixed',
          top: '-100vh',
          left: 0,
          right: 0,
          bottom: 0,
          background: `radial-gradient(4px 4px at 100px 50px, ${snowColor} 50%, transparent),
                      radial-gradient(6px 6px at 200px 150px, ${snowColor} 50%, transparent),
                      radial-gradient(3px 3px at 300px 250px, ${snowColor} 50%, transparent),
                      radial-gradient(4px 4px at 400px 350px, ${snowColor} 50%, transparent),
                      radial-gradient(6px 6px at 500px 100px, ${snowColor} 50%, transparent),
                      radial-gradient(3px 3px at 50px 200px, ${snowColor} 50%, transparent),
                      radial-gradient(4px 4px at 150px 300px, ${snowColor} 50%, transparent),
                      radial-gradient(6px 6px at 250px 400px, ${snowColor} 50%, transparent),
                      radial-gradient(3px 3px at 350px 500px, ${snowColor} 50%, transparent)`,
          backgroundSize: '650px 650px',
          animation: 'snow 10s linear infinite',
        },
        '&::after': {
          marginLeft: '-250px',
          opacity: 0.5,
          filter: 'blur(1px)',
          animation: 'snow 12s linear infinite',
          animationDelay: '-6s',
        }
      }}
    />
  );
} 