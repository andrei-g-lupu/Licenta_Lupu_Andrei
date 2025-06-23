import React from 'react';
import styles from './Message.module.css';

// Definim mai întâi interfața Message
interface MessageType {
  id: string;
  content: string;
  role: string;
}

// Apoi o folosim în MessageProps
interface MessageProps {
  message: MessageType;
  status?: 'sending' | 'sent' | 'error';
}

const Message: React.FC<MessageProps> = ({ message, status }) => {
  return (
    <div className={`${styles.message} ${styles[message.role]}`}>
      {message.role === 'assistant' && (
        <div className={styles.avatar}>AI</div>
      )}
      <div className={styles.content}>
        {message.content}
        {status === 'sending' && (
          <span className="animate-pulse text-gray-400 text-sm ml-2">
            Sending...
          </span>
        )}
        {status === 'error' && (
          <span className="text-red-500 text-sm ml-2">
            Error sending message
          </span>
        )}
      </div>
    </div>
  );
};

export default Message;