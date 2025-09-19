import { useTypingEffect } from '../hooks/useTypingEffect';

const Terminal = () => {
  const line1 = useTypingEffect("print('Empowering researchers through data.')");
  const line2 = useTypingEffect("print('Fostering a culture of collaboration.')");
  const line3 = useTypingEffect("print('Advancing scientific discovery...')");

  return (
    <div className="w-full max-w-lg p-4 rounded-lg bg-gray-900/70 backdrop-blur-sm shadow-2xl font-mono text-sm text-green-400 border border-gray-500/30">
      <div className="flex items-center mb-4">
        <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
        <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
        <div className="w-3 h-3 rounded-full bg-green-500"></div>
      </div>
      <div>
        <span className="text-gray-400">&gt;&gt;&gt; </span>{line1}
        <span className="animate-blink">_</span>
      </div>
      {line1.length === "print('Empowering researchers through data.')".length && (
        <div>
          <span className="text-gray-400">&gt;&gt;&gt; </span>{line2}
          <span className="animate-blink">_</span>
        </div>
      )}
      {line2.length === "print('Fostering a culture of collaboration.')".length && (
        <div>
          <span className="text-gray-400">&gt;&gt;&gt; </span>{line3}
          <span className="animate-blink">_</span>
        </div>
      )}
    </div>
  );
};

export default Terminal;