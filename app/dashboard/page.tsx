"use client"
import React from 'react';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Dashboard
        </h1>
        
        <div className="bg-white shadow rounded-lg p-6">
          <p className="text-gray-600">
            Welcome to your dashboard. This is where you'll see your chat history and settings.
          </p>
        </div>
      </div>
    </div>
  );
} 