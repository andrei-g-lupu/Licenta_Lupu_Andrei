// Chat.tsx
import React from 'react';
import ScrollContainer from './ScrollContainer';
import Message from './Message';
import styles from './Chat.module.css';

interface ChatProps {
  messages: { id: string; content: string; role: string }[]; // Include role for proper rendering
}

const Chat: React.FC<ChatProps> = ({ messages }) => {
  return (
    <div className={styles.chatContainer}>
      <ScrollContainer>
        {messages.map((message) => (
          <Message key={message.id} content={message.content} />
        ))}
      </ScrollContainer>
    </div>
  );
};

export default Chat;



