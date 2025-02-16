import React from 'react';

export default function DisconnectButton() {
  const handleLogout = async () => {
    await fetch('/api/logout', { method: 'POST' }); // Call the logout API
    // Redirect to login page after logout
    window.location.href = '/login'; // Redirect to login page after logout
  };

  return (
    <button
      onClick={handleLogout}
      className="absolute top-4 right-4 px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
    >
      Deconectare
    </button>
  );
}