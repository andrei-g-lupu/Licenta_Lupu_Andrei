import React from 'react';
import { Message } from 'ai';

interface BubbleProps {
  message: Message;
  isLastInGroup?: boolean;
}

const Bubble: React.FC<BubbleProps> = React.memo(({ message, isLastInGroup = false }) => {
  const isUser = message.role === "user";

  // Funcție pentru procesarea textului și convertirea **text** în <strong>text</strong>
  const processMessageContent = (content: string) => {
    const parts = content.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        // Eliminăm asteriscurile și înfășurăm textul în tag-ul strong
        const boldText = part.slice(2, -2);
        return <strong key={index}>{boldText}</strong>;
      }
      return part;
    });
  };

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
        {processMessageContent(message.content)}
      </div>
    </div>
  );
});

Bubble.displayName = 'Bubble';

export default Bubble;