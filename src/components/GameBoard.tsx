import React from 'react';
import { Position } from './SnakeGame';
import { Trophy } from 'lucide-react';

interface GameBoardProps {
  snake: Position[];
  food: Position;
  boardSize: number;
  gameOver: boolean;
  score: number;
  highScore: number;
}

const GameBoard = ({ snake, food, boardSize, gameOver, score, highScore }: GameBoardProps) => {
  const renderCell = (x: number, y: number) => {
    const isSnakeHead = snake[0]?.x === x && snake[0]?.y === y;
    const isSnakeBody = snake.slice(1).some(segment => segment.x === x && segment.y === y);
    const isFood = food.x === x && food.y === y;

    let cellClass = "w-full h-full transition-all duration-75 ";

    if (isSnakeHead) {
      cellClass += gameOver 
        ? "bg-red-500 shadow-lg shadow-red-500/50" 
        : "bg-green-400 shadow-lg shadow-green-400/50 animate-pulse";
    } else if (isSnakeBody) {
      cellClass += "bg-green-600";
    } else if (isFood) {
      cellClass += "bg-red-500 rounded-full shadow-lg shadow-red-500/50 animate-pulse";
    } else {
      cellClass += "bg-gray-800/30 border border-gray-700/20";
    }

    return (
      <div key={`${x}-${y}`} className="relative">
        <div className={cellClass}>
          {isFood && (
            <div className="absolute inset-0 flex items-center justify-center text-yellow-400 text-xs">
              🍎
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-700/30 relative">
      <div 
        className={`grid gap-[1px] bg-gray-700/20 rounded-lg p-2 transition-opacity duration-300 ${
          gameOver ? 'opacity-60' : 'opacity-100'
        }`}
        style={{
          gridTemplateColumns: `repeat(${boardSize}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${boardSize}, minmax(0, 1fr))`,
          aspectRatio: '1',
        }}
      >
        {Array.from({ length: boardSize }, (_, y) =>
          Array.from({ length: boardSize }, (_, x) => renderCell(x, y))
        )}
      </div>
      
      {gameOver && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-xl">
          <div className="text-center animate-scale-in bg-gray-900/90 p-8 rounded-xl border border-gray-700">
            <div className="text-4xl mb-4">💀</div>
            <div className="text-white text-2xl font-bold mb-4">Game Over!</div>
            
            <div className="space-y-3 mb-6">
              <div className="text-gray-300">
                <span className="text-lg">Final Score: </span>
                <span className="text-white text-xl font-bold">{score}</span>
              </div>
              
              <div className="flex items-center justify-center gap-2 text-yellow-400">
                <Trophy className="w-5 h-5" />
                <span className="text-lg">High Score: </span>
                <span className="text-xl font-bold">{highScore}</span>
              </div>
              
              {score === highScore && score > 0 && (
                <div className="text-yellow-400 text-sm font-medium animate-pulse">
                  🎉 New High Score! 🎉
                </div>
              )}
            </div>
            
            <div className="text-gray-400 text-sm">
              Click "Play Again" to start a new game
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameBoard;