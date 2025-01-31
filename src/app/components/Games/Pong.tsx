import { useEffect, useRef, useState, useCallback } from 'react';
import { Box, Button, HStack, Text, VStack, useBreakpointValue } from '@chakra-ui/react';

interface PongProps {
  width?: number;
  height?: number;
}

interface GameState {
  paddle1Y: number;
  paddle2Y: number;
  ballX: number;
  ballY: number;
  ballSpeedX: number;
  ballSpeedY: number;
  score1: number;
  score2: number;
}

export const Pong: React.FC<PongProps> = ({ width: propWidth = 400, height: propHeight = 300 }) => {
  // Make the game responsive based on screen size
  const width = useBreakpointValue({ base: 320, md: propWidth }) ?? propWidth;
  const height = useBreakpointValue({ base: 240, md: propHeight }) ?? propHeight;
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameLoopRef = useRef<number | null>(null);
  const gameStateRef = useRef<GameState>({
    paddle1Y: height / 2 - 30,
    paddle2Y: height / 2 - 30,
    ballX: width / 2,
    ballY: height / 2,
    ballSpeedX: 5,
    ballSpeedY: 5,
    score1: 0,
    score2: 0
  });
  const [isPaused, setIsPaused] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  const paddleHeight = 60;
  const paddleWidth = 10;
  const ballSize = 8;
  const maxBallSpeed = 8;
  const minBallSpeed = 4;

  const resetBall = useCallback(() => {
    const state = gameStateRef.current;
    state.ballX = width / 2;
    state.ballY = height / 2;
    // Randomize initial direction
    const angle = (Math.random() * Math.PI / 2) - Math.PI / 4; // -45 to 45 degrees
    const speed = minBallSpeed;
    state.ballSpeedX = Math.cos(angle) * speed * (Math.random() < 0.5 ? 1 : -1);
    state.ballSpeedY = Math.sin(angle) * speed;
  }, [width, height]);

  const startGame = useCallback(() => {
    const state = gameStateRef.current;
    state.score1 = 0;
    state.score2 = 0;
    resetBall();
    setGameStarted(true);
    setIsPaused(false);
  }, [resetBall]);

  const togglePause = useCallback(() => {
    setIsPaused(p => !p);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    const draw = () => {
      const state = gameStateRef.current;
      
      // Clear canvas
      context.fillStyle = '#000000';
      context.fillRect(0, 0, width, height);

      // Draw paddles
      context.fillStyle = '#FFFFFF';
      context.fillRect(0, state.paddle1Y, paddleWidth, paddleHeight);
      context.fillRect(width - paddleWidth, state.paddle2Y, paddleWidth, paddleHeight);

      // Draw ball
      context.beginPath();
      context.arc(state.ballX, state.ballY, ballSize, 0, Math.PI * 2);
      context.fillStyle = '#FFFFFF';
      context.fill();
      context.closePath();

      // Draw scores
      context.font = '20px Arial';
      context.textAlign = 'center';
      context.fillText(state.score1.toString(), width / 4, 30);
      context.fillText(state.score2.toString(), (width * 3) / 4, 30);

      // Draw center line
      context.setLineDash([5, 5]);
      context.beginPath();
      context.moveTo(width / 2, 0);
      context.lineTo(width / 2, height);
      context.strokeStyle = '#FFFFFF';
      context.stroke();
    };

    const update = () => {
      if (!gameStarted || isPaused) return;
      
      const state = gameStateRef.current;

      // Move ball
      state.ballX += state.ballSpeedX;
      state.ballY += state.ballSpeedY;

      // Ball collision with top and bottom
      if (state.ballY <= ballSize || state.ballY >= height - ballSize) {
        state.ballSpeedY = -state.ballSpeedY;
        // Add some randomness to prevent loops
        state.ballSpeedY += (Math.random() - 0.5) * 0.5;
      }

      // Ball collision with paddles
      if (
        (state.ballX <= paddleWidth + ballSize && 
         state.ballY >= state.paddle1Y && 
         state.ballY <= state.paddle1Y + paddleHeight) ||
        (state.ballX >= width - paddleWidth - ballSize && 
         state.ballY >= state.paddle2Y && 
         state.ballY <= state.paddle2Y + paddleHeight)
      ) {
        // Reverse X direction
        state.ballSpeedX = -state.ballSpeedX;
        
        // Add speed based on where the ball hits the paddle
        const paddle = state.ballX <= paddleWidth + ballSize ? state.paddle1Y : state.paddle2Y;
        const relativeIntersectY = (paddle + (paddleHeight / 2)) - state.ballY;
        const normalizedIntersectY = relativeIntersectY / (paddleHeight / 2);
        const bounceAngle = normalizedIntersectY * Math.PI / 3; // Max 60 degrees

        const speed = Math.min(Math.sqrt(state.ballSpeedX * state.ballSpeedX + state.ballSpeedY * state.ballSpeedY) + 0.5, maxBallSpeed);
        state.ballSpeedX = Math.cos(bounceAngle) * speed * (state.ballX <= paddleWidth + ballSize ? 1 : -1);
        state.ballSpeedY = -Math.sin(bounceAngle) * speed;
      }

      // Score points
      if (state.ballX <= 0) {
        state.score2++;
        resetBall();
      } else if (state.ballX >= width) {
        state.score1++;
        resetBall();
      }

      // Smarter AI movement with prediction and slight delay
      const prediction = state.ballY + (state.ballSpeedY * (width - state.ballX) / state.ballSpeedX);
      const targetY = Math.min(Math.max(prediction - paddleHeight / 2, 0), height - paddleHeight);
      const diff = targetY - state.paddle2Y;
      state.paddle2Y += Math.sign(diff) * Math.min(Math.abs(diff) * 0.1, 4);
    };

    const handleMove = (clientY: number) => {
      if (!gameStarted || isPaused) return;
      const rect = canvas.getBoundingClientRect();
      const y = clientY - rect.top;
      gameStateRef.current.paddle1Y = Math.min(
        Math.max(y - paddleHeight / 2, 0),
        height - paddleHeight
      );
    };

    const handleMouseMove = (e: MouseEvent) => {
      handleMove(e.clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault(); // Prevent scrolling while playing
      if (e.touches.length > 0) {
        handleMove(e.touches[0].clientY);
      }
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
    canvas.addEventListener('touchstart', handleTouchMove, { passive: false });

    const gameLoop = () => {
      update();
      draw();
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };

    gameLoopRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('touchstart', handleTouchMove);
    };
  }, [width, height, resetBall, gameStarted, isPaused]);

  return (
    <VStack spacing={4} w="100%" maxW={width}>
      <Box 
        border="1px solid" 
        borderColor="gray.200" 
        borderRadius="md" 
        overflow="hidden"
        w="100%"
        style={{ touchAction: 'none' }}
      >
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          style={{ display: 'block', width: '100%', height: 'auto' }}
        />
      </Box>
      <HStack spacing={4}>
        {!gameStarted ? (
          <Button colorScheme="blue" onClick={startGame}>
            Start Game
          </Button>
        ) : (
          <Button colorScheme={isPaused ? "green" : "yellow"} onClick={togglePause}>
            {isPaused ? "Resume" : "Pause"}
          </Button>
        )}
      </HStack>
      <Text fontSize="sm" color="gray.500" textAlign="center">
        {useBreakpointValue({
          base: "Touch and drag to move the left paddle",
          md: "Use your mouse to move the left paddle up and down"
        })}
      </Text>
    </VStack>
  );
}; 