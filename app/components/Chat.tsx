// Chat.tsx
import React, { useRef, useEffect } from 'react';
import ScrollContainer from './ScrollContainer';
import Message from './Message';
import styles from './Chat.module.css';

interface ChatProps {
  messages: { id: string; content: string; role: string }[]; // Include role for proper rendering
}

const Chat: React.FC<ChatProps> = ({ messages }) => {
  // Adaugă un ref pentru a menține scroll-ul la ultimul mesaj
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll automat la ultimul mesaj
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className={styles.chatContainer}>
      <ScrollContainer>
        {messages.map((message) => (
          <Message 
            key={message.id} 
            content={message.content}
            role={message.role}
          />
        ))}
        <div ref={messagesEndRef} />
      </ScrollContainer>
    </div>
  );
};

export default Chat;



