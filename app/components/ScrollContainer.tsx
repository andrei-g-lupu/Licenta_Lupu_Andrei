import React, { useEffect, useRef } from 'react';
import styles from './ScrollContainer.module.css';

const ScrollContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [children]);

  return (
    <div ref={containerRef} className={styles.scrollContainer}>
      {children}
    </div>
  );
};

export default ScrollContainer;