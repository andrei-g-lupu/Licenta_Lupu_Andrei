import React, { useEffect, useRef } from 'react';

interface ScrollContainerProps {
  children: React.ReactNode;
}

const ScrollContainer: React.FC<ScrollContainerProps> = ({ children }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [children]);

  return (
    <div 
      ref={containerRef} 
      className="overflow-y-auto max-h-[600px] space-y-4 p-2 scroll-smooth"
    >
      {children}
    </div>
  );
};

export default ScrollContainer;