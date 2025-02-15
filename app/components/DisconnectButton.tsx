import React from 'react';

export default function DisconnectButton() {
  return (
    <button
      onClick={() => window.location.href = '/'}
      className="absolute top-4 right-4 px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
    >
      Deconectare
    </button>
  );
}