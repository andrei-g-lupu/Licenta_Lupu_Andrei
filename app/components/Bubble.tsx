import React from 'react';
import { Message } from 'ai';

interface BubbleProps {
  message: Message;
  isLastInGroup?: boolean;
}

const Bubble: React.FC<BubbleProps> = React.memo(({ message, isLastInGroup = false }) => {
  const isUser = message.role === "user";

  return (
    <div 
      className={`flex ${isUser ? "justify-end" : "justify-start"} ${
        isLastInGroup ? "mb-4" : "mb-2"
      }`}
    >
      <div
        className={`max-w-[90%] sm:max-w-[80%] p-3 sm:p-4 text-sm sm:text-base rounded-lg ${
          isUser
            ? "bg-blue-600 text-white rounded-br-none"
            : "bg-gray-100 text-gray-800 rounded-bl-none"
        } shadow-sm`}
      >
        {message.content}
      </div>
    </div>
  );
});

Bubble.displayName = 'Bubble';

export default Bubble;