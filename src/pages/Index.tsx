
import SnakeGame from '../components/SnakeGame';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-2 animate-fade-in">
            🐍 Snake Game
          </h1>
          <p className="text-gray-300 text-lg">
            Use arrow keys to control the snake and eat the food!
          </p>
        </div>
        <SnakeGame />
      </div>
    </div>
  );
};

export default Index;
