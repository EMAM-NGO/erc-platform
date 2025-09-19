import { useState, useEffect } from 'react';

// The type here is now corrected to accept a potentially null ref
export const useParallax = (ref: React.RefObject<HTMLDivElement | null>) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (ref.current) {
        const { clientX, clientY } = e;
        const { width, height, left, top } = ref.current.getBoundingClientRect();
        const x = (clientX - left - width / 2) / (width / 2);
        const y = (clientY - top - height / 2) / (height / 2);
        setPosition({ x, y });
      }
    };

    const currentRef = ref.current;
    if (currentRef) {
      currentRef.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      if (currentRef) {
        currentRef.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, [ref]);

  return position;
};