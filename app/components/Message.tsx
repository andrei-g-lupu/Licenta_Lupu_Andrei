import React from 'react';
import styles from './Message.module.css';

interface MessageProps {
  content: string;
}

const Message: React.FC<MessageProps> = ({ content }) => {
  return (
    <div className={styles.message}>
      {content}
    </div>
  );
};

export default Message;