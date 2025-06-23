import React from 'react';

const ThinkingBubble: React.FC = () => {
  return (
    <div className="flex justify-start mb-4 animate-fade-in">
      <div className="bg-gray-100 text-gray-800 rounded-lg rounded-bl-none p-4 max-w-[80%] shadow-sm">
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1">
            {[0, 1, 2].map((i) => (
              <div 
                key={i}
                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                style={{ 
                  animationDelay: `${i * 200}ms`,
                  animationDuration: '1s'
                }}
              />
            ))}
          </div>
          <span className="text-sm text-gray-500 ml-2">Se gândește...</span>
        </div>
      </div>
    </div>
  );
};

export default ThinkingBubble; 