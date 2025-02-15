import React from 'react';
import styles from './Message.module.css';

interface MessageProps {
  content: string;
  role?: 'user' | 'assistant';
}

const Message: React.FC<MessageProps> = ({ content, role = 'assistant' }) => {
  return (
    <div className={`${styles.message} ${styles[role]}`}>
      {role === 'assistant' && (
        <div className={styles.avatar}>AI</div>
      )}
      <div className={styles.content}>{content}</div>
    </div>
  );
};

export default Message;