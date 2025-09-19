import { useState, useEffect } from 'react';

export const useTypingEffect = (text: string, speed: number = 50) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    setDisplayedText(''); // Reset when text changes
    const interval = setInterval(() => {
      setDisplayedText((prev) => {
        if (prev.length < text.length) {
          return prev + text[prev.length];
        }
        clearInterval(interval);
        return prev;
      });
    }, speed);

    return () => {
      clearInterval(interval);
    };
  }, [text, speed]);

  return displayedText;
};