"use client"
import React, { useEffect, useState } from 'react';
import Image from "next/image";
import { useChat } from "ai/react"
import { Message } from "ai"
import GPTlogo from "../public/Unchiul Steli.png";   
import Bubble from "../components/Bubble";
import LoadingBubble from "../components/LoadingBubble";
import PromptSuggestionRow from "../components/PromptSuggestionRow";
import DisconnectButton from "../components/DisconnectButton";

const ChatPage: React.FC = () => {
  // Initialize conversation ID from localStorage
  const [conversationId, setConversationId] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('currentConversationId');
      if (saved) return saved;
      const newId = crypto.randomUUID();
      localStorage.setItem('currentConversationId', newId);
      return newId;
    }
    return '';
  });

  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [initialMessages, setInitialMessages] = useState<Message[]>([]);

  // Load chat history first
  useEffect(() => {
    const loadChatHistory = async () => {
      if (!conversationId) return;
      
      try {
        setIsLoadingHistory(true);
        const response = await fetch(`/api/chat-history?conversationId=${conversationId}`, { credentials: 'include' });
        if (response.ok) {
          const history = await response.json();
          const existingConversation = history.find(
            (conv: any) => conv.conversation_id === conversationId
          );
          
          if (existingConversation) {
            const formattedMessages = existingConversation.messages.map((msg: any) => ({
              id: msg.id,
              content: msg.message_content,
              role: msg.role as "user" | "assistant"
            }));
            setInitialMessages(formattedMessages);
          }
        }
      } catch (error) {
        console.error('Failed to load chat history:', error);
      } finally {
        setIsLoadingHistory(false);
      }
    };

    loadChatHistory();
  }, [conversationId]);

  // Initialize chat after history is loaded
  const { messages, input, handleInputChange, handleSubmit, isLoading, append, setMessages } = useChat({
    id: conversationId,
    initialMessages,
    body: {
      conversationId
    },
    onResponse: (response) => {
      // Ensure conversation ID is saved after each response
      localStorage.setItem('currentConversationId', conversationId);
    },
    onFinish: () => {
      // Update messages in state after completion
      if (messages.length > 0) {
        setInitialMessages(messages);
      }
    }
  });

  // Update messages when initialMessages changes
  useEffect(() => {
    if (initialMessages.length > 0) {
      setMessages(initialMessages);
    }
  }, [initialMessages, setMessages]);

  const handlePrompt = (promptText: string) => {
    append({
      id: crypto.randomUUID(),
      content: promptText,
      role: "user"
    });
  };

  const startNewChat = () => {
    const newConversationId = crypto.randomUUID();
    localStorage.setItem('currentConversationId', newConversationId);
    setConversationId(newConversationId);
    setInitialMessages([]);
    setMessages([]);
  };

  if (isLoadingHistory) {
    return <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4">
      <div className="w-full flex justify-between items-center p-4">
        <DisconnectButton />
        <button
          onClick={startNewChat}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Start New Chat
        </button>
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