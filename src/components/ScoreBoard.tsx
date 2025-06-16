import React from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw, Trophy } from 'lucide-react';

interface ScoreBoardProps {
  score: number;
  highScore: number;
  isPlaying: boolean;
  gameOver: boolean;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
}

const ScoreBoard = ({ 
  score, 
  highScore,
  isPlaying, 
  gameOver, 
  onStart, 
  onPause, 
  onReset 
}: ScoreBoardProps) => {
  return (
    <div className="flex items-center justify-between mb-6 bg-gray-800/30 rounded-lg p-4 border border-gray-700/20">
      <div className="flex items-center space-x-6">
        <div className="text-center">
          <div className="text-gray-400 text-sm font-medium">Score</div>
          <div className="text-white text-2xl font-bold animate-fade-in">
            {score}
          </div>
        </div>

        <div className="text-center">
          <div className="text-gray-400 text-sm font-medium flex items-center gap-1">
            <Trophy className="w-3 h-3" />
            High Score
          </div>
          <div className="text-yellow-400 text-xl font-bold">
            {highScore}
          </div>
        </div>
        
        <div className="text-center">
          <div className="text-gray-400 text-sm font-medium">Status</div>
          <div className={`text-sm font-semibold ${
            gameOver 
              ? 'text-red-400' 
              : isPlaying 
                ? 'text-green-400' 
                : 'text-yellow-400'
          }`}>
            {gameOver ? 'Game Over' : isPlaying ? 'Playing' : 'Paused'}
          </div>
        </div>
      </div>

      <div className="flex space-x-2">
        {!gameOver && (
          <Button
            onClick={isPlaying ? onPause : onStart}
            className={`${
              isPlaying 
                ? 'bg-yellow-600 hover:bg-yellow-700' 
                : 'bg-green-600 hover:bg-green-700'
            } text-white transition-colors`}
            size="sm"
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
            {isPlaying ? 'Pause' : 'Start'}
          </Button>
        )}
        
        <Button
          onClick={onReset}
          className="bg-blue-600 hover:bg-blue-700 text-white transition-colors"
          size="sm"
        >
          <RotateCcw size={16} />
          {gameOver ? 'Play Again' : 'Reset'}
        </Button>
      </div>
    </div>
  );
};

export default ScoreBoard;