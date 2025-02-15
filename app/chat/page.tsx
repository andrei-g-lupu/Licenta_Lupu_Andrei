"use client"
import React from 'react';
import Image from "next/image";
import { useChat } from "ai/react"
import { Message } from "ai"
import GPTlogo from "../public/Unchiul Steli.png";   
import Bubble from "../components/Bubble";
import LoadingBubble from "../components/LoadingBubble";
import PromptSuggestionRow from "../components/PromptSuggestionRow";
import DisconnectButton from "../components/DisconnectButton";

const ChatPage: React.FC = () => {
  const { messages, input, handleInputChange, handleSubmit, isLoading, append } = useChat();

  const handlePrompt = (promptText: string) => {
    append({
      id: crypto.randomUUID(),
      content: promptText,
      role: "user"
    });
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4">
      <DisconnectButton />
      <div className="z-10 max-w-5xl w-full items-center justify-between text-sm lg:flex">
      </div>

      <div className="relative flex place-items-center">
        <Image
          src={GPTlogo}
          width="150"
          height="150"
          alt="GPTLogo"
          className="rounded-full"
        />
      </div>

      <section className="flex-1 w-full max-w-4xl mx-auto overflow-hidden flex flex-col">
        {!messages?.length ? (
          <div className="text-center p-4">
            <p>Asistentul tau virtual pentru intrebari din domeniul X.</p>
            <PromptSuggestionRow onPromptClick={handlePrompt} />
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto px-4 py-2">
            {messages.map((message) => (
              <Bubble key={message.id} message={message} />
            ))}
            {isLoading && <LoadingBubble />}
          </div>
        )}

        <div className="p-4 border-t">
          <form onSubmit={handleSubmit} className="flex gap-4">
            <input
              value={input}
              onChange={handleInputChange}
              placeholder="Intreaba-ma ceva..."
              className="flex-1 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button 
              type="submit"
              disabled={isLoading}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              Trimite
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}

export default ChatPage; 