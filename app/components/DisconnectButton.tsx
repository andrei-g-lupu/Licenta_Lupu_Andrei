import React from 'react';

const DisconnectButton: React.FC = () => {
  const handleDisconnect = async () => {
    try {
      const response = await fetch('/api/logout', {
        method: 'POST',
      });

      if (response.ok) {
        console.log('Disconnected');
        window.location.href = '/login';
      } else {
        console.error('Failed to disconnect');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <button
      onClick={handleDisconnect}
      className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded"
    >
      Disconnect
    </button>
  );
};

export default DisconnectButton;