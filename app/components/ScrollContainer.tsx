import React, { useEffect, useRef, useState } from 'react';

interface ScrollContainerProps {
  children: React.ReactNode;
  onLoadMore?: () => void;
  hasMore?: boolean;
}

const ScrollContainer: React.FC<ScrollContainerProps> = ({ 
  children, 
  onLoadMore,
  hasMore = false 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !onLoadMore) return

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