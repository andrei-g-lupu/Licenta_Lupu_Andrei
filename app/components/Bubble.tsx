import React from 'react';
import { Message } from 'ai';

interface BubbleProps {
  message: Message;
}

export default function Bubble({ message }: BubbleProps) {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
      <div
        className={`max-w-[80%] p-4 rounded-lg ${
          isUser
            ? "bg-blue-600 text-white rounded-br-none"
            : "bg-gray-100 text-gray-800 rounded-bl-none"
        } shadow-sm`}
      >
        {message.content}
      </div>
    </div>
  );
}