import React, { useState, useEffect, useCallback } from 'react';
import GameBoard from './GameBoard';
import ScoreBoard from './ScoreBoard';
import { useToast } from '@/hooks/use-toast';

export interface Position {
  x: number;
  y: number;
}

export interface GameState {
  snake: Position[];
  food: Position;
  direction: Position;
  gameOver: boolean;
  score: number;
}

const BOARD_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const GAME_SPEED = 150;
const HIGH_SCORE_KEY = 'snake-game-high-score';

const SnakeGame = () => {
  const { toast } = useToast();
  const [gameState, setGameState] = useState<GameState>({
    snake: INITIAL_SNAKE,
    food: { x: 15, y: 15 },
    direction: INITIAL_DIRECTION,
    gameOver: false,
    score: 0,
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const [highScore, setHighScore] = useState(0);

  // Load high score from localStorage on component mount
  useEffect(() => {
    const savedHighScore = localStorage.getItem(HIGH_SCORE_KEY);
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore, 10));
    }
  }, []);

  // Save high score to localStorage when it changes
  const updateHighScore = useCallback((newScore: number) => {
    const currentHighScore = parseInt(localStorage.getItem(HIGH_SCORE_KEY) || '0', 10);
    if (newScore > currentHighScore) {
      localStorage.setItem(HIGH_SCORE_KEY, newScore.toString());
      setHighScore(newScore);
      
      // Show celebration toast for new high score
      toast({
        title: "🎉 NEW HIGH SCORE! 🎉",
        description: `Congratulations! You scored ${newScore} points!`,
        duration: 5000,
      });
      
      return true; // Indicates a new high score was set
    }
    return false;
  }, [toast]);

  const generateFood = useCallback((snake: Position[]): Position => {
    let newFood: Position;
    do {
      newFood = {
        x: Math.floor(Math.random() * BOARD_SIZE),
        y: Math.floor(Math.random() * BOARD_SIZE),
      };
    } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    return newFood;
  }, []);

  const moveSnake = useCallback(() => {
    if (gameState.gameOver || !isPlaying) return;

    setGameState(prevState => {
      const newSnake = [...prevState.snake];
      const head = { ...newSnake[0] };
      
      head.x += prevState.direction.x;
      head.y += prevState.direction.y;

      // Check wall collision
      if (head.x < 0 || head.x >= BOARD_SIZE || head.y < 0 || head.y >= BOARD_SIZE) {
        updateHighScore(prevState.score);
        toast({
          title: "Game Over!",
          description: `You hit the wall! Final score: ${prevState.score}`,
          variant: "destructive",
        });
        return { ...prevState, gameOver: true };
      }

      // Check self collision
      if (newSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
        updateHighScore(prevState.score);
        toast({
          title: "Game Over!",
          description: `You hit yourself! Final score: ${prevState.score}`,
          variant: "destructive",
        });
        return { ...prevState, gameOver: true };
      }

      newSnake.unshift(head);

      // Check food collision
      if (head.x === prevState.food.x && head.y === prevState.food.y) {
        const newFood = generateFood(newSnake);
        const newScore = prevState.score + 10;
        
        // Show eating feedback
        toast({
          title: "🍎 Yummy!",
          description: `Score: ${newScore}`,
          duration: 1000,
        });
        
        return {
          ...prevState,
          snake: newSnake,
          food: newFood,
          score: newScore,
        };
      } else {
        newSnake.pop();
      }

      return {
        ...prevState,
        snake: newSnake,
      };
    });
  }, [gameState.gameOver, isPlaying, generateFood, toast, updateHighScore]);

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    if (gameState.gameOver) return;
    
    const { direction } = gameState;
    
    switch (e.key) {
      case 'ArrowUp':
        if (direction.y === 0) {
          setGameState(prev => ({ ...prev, direction: { x: 0, y: -1 } }));
        }
        break;
      case 'ArrowDown':
        if (direction.y === 0) {
          setGameState(prev => ({ ...prev, direction: { x: 0, y: 1 } }));
        }
        break;
      case 'ArrowLeft':
        if (direction.x === 0) {
          setGameState(prev => ({ ...prev, direction: { x: -1, y: 0 } }));
        }
        break;
      case 'ArrowRight':
        if (direction.x === 0) {
          setGameState(prev => ({ ...prev, direction: { x: 1, y: 0 } }));
        }
        break;
      case ' ':
        e.preventDefault();
        setIsPlaying(prev => !prev);
        break;
    }
  }, [gameState.direction, gameState.gameOver]);

  const resetGame = () => {
    const newFood = generateFood(INITIAL_SNAKE);
    setGameState({
      snake: INITIAL_SNAKE,
      food: newFood,
      direction: INITIAL_DIRECTION,
      gameOver: false,
      score: 0,
    });
    setIsPlaying(false);
  };

  const startGame = () => {
    if (gameState.gameOver) {
      resetGame();
    }
    setIsPlaying(true);
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  useEffect(() => {
    const gameInterval = setInterval(moveSnake, GAME_SPEED);
    return () => clearInterval(gameInterval);
  }, [moveSnake]);

  return (
    <div className="bg-black/20 backdrop-blur-lg rounded-2xl p-6 border border-white/10 shadow-2xl">
      <ScoreBoard 
        score={gameState.score} 
        highScore={highScore}
        isPlaying={isPlaying} 
        gameOver={gameState.gameOver}
        onStart={startGame}
        onPause={() => setIsPlaying(false)}
        onReset={resetGame}
      />
      <GameBoard 
        snake={gameState.snake}
        food={gameState.food}
        boardSize={BOARD_SIZE}
        gameOver={gameState.gameOver}
        score={gameState.score}
        highScore={highScore}
        direction={gameState.direction}
      />
      <div className="mt-4 text-center text-gray-400 text-sm">
        Use arrow keys to move • Space to pause • Click Start to begin
      </div>
    </div>
  );
};

export default SnakeGame;