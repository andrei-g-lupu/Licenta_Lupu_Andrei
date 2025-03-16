"use client"
import React, { useEffect, useState } from 'react';
import Image from "next/image";
import { useChat } from "ai/react"
import { Message } from "ai"
import { useRouter } from 'next/navigation';
import GPTlogo from "../public/Unchiul Steli.png";   
import Bubble from "../components/Bubble";
import LoadingBubble from "../components/LoadingBubble";
import PromptSuggestionRow from "../components/PromptSuggestionRow";
import DisconnectButton from "../components/DisconnectButton";

// Adăugăm înapoi ThinkingBubble component
const ThinkingBubble: React.FC = () => {
  return (
    <div className="flex justify-start mb-4 animate-fade-in">
      <div className="bg-gray-100 text-gray-800 rounded-lg rounded-bl-none p-4 max-w-[80%] shadow-sm">
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1">
            {[0, 1, 2].map((i) => (
              <div 
                key={i}
                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                style={{ 
                  animationDelay: `${i * 200}ms`,
                  animationDuration: '1s'
                }}
              />
            ))}
          </div>
          <span className="text-sm text-gray-500 ml-2">Se gândește...</span>
        </div>
      </div>
    </div>
  );
};

const ChatPage: React.FC = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [initialMessages, setInitialMessages] = useState<Message[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const [isStartingNewChat, setIsStartingNewChat] = useState(false);

  // Modificăm logica de inițializare a conversationId
  const [conversationId] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      // Verificăm dacă avem un ID valid în localStorage
      const saved = localStorage.getItem('currentConversationId');
      // Dacă nu avem ID sau dacă pagina tocmai s-a încărcat (nu din cache),
      // generăm unul nou
      if (!saved || !document.referrer) {
        const newId = crypto.randomUUID();
        localStorage.setItem('currentConversationId', newId);
        return newId;
      }
      return saved;
    }
    return '';
  });

  // Adăugăm un effect pentru a monitoriza schimbările de conversație
  useEffect(() => {
    console.log("Current conversation ID:", conversationId);
    // Opțional: putem verifica aici dacă ID-ul este valid
    if (conversationId) {
      console.log("Starting new conversation with ID:", conversationId);
    }
  }, [conversationId]);

  // Folosim handleSubmit din useChat
  const { messages, input, handleInputChange, handleSubmit, append, setMessages } = useChat({
    id: conversationId,
    initialMessages,
    body: { conversationId },
    onResponse: (response) => {
      localStorage.setItem('currentConversationId', conversationId);
      setIsThinking(false);
    },
    onFinish: () => {
      setIsThinking(false);
    }
  });

  // Handler pentru sugestii corectat
  const handleSuggestionClick = (promptText: string) => {
    append({
      role: 'user',
      content: promptText,
      id: crypto.randomUUID()
    });
  };

  // Auth check effect
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/chat-history', { 
          credentials: 'include',
          headers: { 'Cache-Control': 'no-cache' }
        });
        if (!response.ok) {
          router.replace('/login');
        }
      } catch (error) {
        router.replace('/login');
      }
    };

    checkAuth();
  }, [router]);

  // Load initial messages effect
  useEffect(() => {
    const loadInitialMessages = async () => {
      if (!conversationId) return;
      
      try {
        setIsLoading(true);
        const response = await fetch(
          `/api/chat-history?conversationId=${conversationId}`,
          { credentials: 'include' }
        );
        
        if (response.ok) {
          const history = await response.json();
          const existingConversation = history.find(
            (conv: any) => conv.conversation_id === conversationId
          );
          
          if (existingConversation) {
            // Formatăm mesajele și ne asigurăm că sunt în ordinea corectă
            const formattedMessages = existingConversation.messages
              .map((msg: any) => ({
                id: msg.id,
                content: msg.message_content,
                role: msg.role as "user" | "assistant",
                createdAt: new Date(msg.created_at).getTime()
              }))
              .sort((a, b) => a.createdAt - b.createdAt);

            setInitialMessages(formattedMessages);
            setMessages(formattedMessages);
          }
        }
      } catch (error) {
        console.error('Failed to load chat history:', error);
        setError('Failed to load chat history');
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialMessages();
  }, [conversationId, setMessages]);

  const startNewChat = async () => {
    setIsStartingNewChat(true);
    
    // Generăm un nou ID de conversație
    const newConversationId = crypto.randomUUID();
    
    // Curățăm localStorage de ID-ul vechi și setăm unul nou
    localStorage.removeItem('currentConversationId');
    localStorage.setItem('currentConversationId', newConversationId);
    
    // Curățăm mesajele și resetăm starea
    setMessages([]);
    
    // Opțional: Putem să forțăm un refresh al paginii pentru un restart complet
    window.location.href = '/chat';
    
    setIsStartingNewChat(false);
  };

  // Render messages
  const renderMessages = () => {
    return messages.map((message, index) => (
      <Bubble 
        key={`${message.id}-${index}`}
        message={message}
        isLastInGroup={
          index === messages.length - 1 || 
          messages[index + 1]?.role !== message.role
        }
      />
    ));
  };

  // Wrapper pentru handleSubmit pentru a gestiona starea de thinking
  const handleSubmitWrapper = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    setIsThinking(true);
    await handleSubmit(e);
  };

  if (isStartingNewChat) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="flex space-x-2 mb-4">
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '200ms' }}></div>
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '400ms' }}></div>
          </div>
          <p className="text-gray-600">Se inițializează un chat nou...</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 sm:p-6">
      <div className="w-full flex justify-between items-center p-2 sm:p-4">
        <DisconnectButton />
        <button
          onClick={startNewChat}
          className="absolute top-4 px-3 sm:px-4 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center"
          disabled={isStartingNewChat}
        >
          Chat Nou
        </button>
      </div>

      <div className="relative flex place-items-center mt-16 sm:mt-0">
        <Image
          src={GPTlogo}
          width="150"
          height="150"
          alt="GPTLogo"
          className="rounded-full w-24 h-24 sm:w-32 sm:h-32"
        />
      </div>

      <section className="flex-1 w-full max-w-4xl mx-auto overflow-hidden flex flex-col">
        {!messages?.length ? (
          <div className="text-center p-4">
            <p>Asistentul tau virtual pentru intrebari din domeniul X.</p>
            <PromptSuggestionRow onPromptClick={handleSuggestionClick} />
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto px-4 py-2 mb-20">
            <div className="flex flex-col">
              {renderMessages()}
              {(isLoading || isThinking) && (
                <ThinkingBubble />
              )}
            </div>
          </div>
        )}

        <div className="fixed bottom-0 left-0 right-0 p-2 sm:p-4 border-t bg-white">
          <div className="max-w-4xl mx-auto w-full">
            <form onSubmit={handleSubmitWrapper} className="flex gap-2 sm:gap-4">
              <input
                value={input}
                onChange={handleInputChange}
                placeholder="Intreaba-ma ceva..."
                className="flex-1 p-2 sm:p-4 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading || isThinking}
              />
              <button 
                type="submit"
                disabled={!input.trim() || isLoading || isThinking}
                className="bg-blue-600 text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-all duration-200 text-sm sm:text-base whitespace-nowrap"
              >
                {(isLoading || isThinking) ? 'Se procesează...' : 'Trimite'}
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ChatPage; 