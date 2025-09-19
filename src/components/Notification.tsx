import React from 'react';

type NotificationProps = {
  message: string;
  type: 'success' | 'error';
};

const Notification: React.FC<NotificationProps> = ({ message, type }) => {
  const baseClasses = 'fixed bottom-5 right-5 p-4 rounded-lg shadow-lg text-white font-bold';
  const typeClasses = type === 'success' ? 'bg-green-500' : 'bg-red-500';

  return (
    <div className={`${baseClasses} ${typeClasses}`}>
      {message}
    </div>
  );
};

export default Notification;