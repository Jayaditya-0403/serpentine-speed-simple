
import React from 'react';
import { Position } from './SnakeGame';

interface GameBoardProps {
  snake: Position[];
  food: Position;
  boardSize: number;
  gameOver: boolean;
}

const GameBoard = ({ snake, food, boardSize, gameOver }: GameBoardProps) => {
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
    <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-700/30">
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
          <div className="text-center animate-scale-in">
            <div className="text-4xl mb-2">💀</div>
            <div className="text-white text-xl font-bold">Game Over!</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameBoard;
