"use client"
import React, { useEffect, useState, useCallback, useRef } from 'react';
import Image from "next/image";
import { useChat } from "ai/react"
import { Message } from "ai"
import { useRouter } from 'next/navigation';
import { Menu } from 'lucide-react';
import GPTlogo from "../public/Unchiul Steli.png";   
import Bubble from "../components/Bubble";
import LoadingBubble from "../components/LoadingBubble";
import PromptSuggestionRow from "../components/PromptSuggestionRow";
import DisconnectButton from "../components/DisconnectButton";
import ChatHistoryDrawer from "../components/ChatHistoryDrawer";
import MobileMenuButton from "../components/MobileMenuButton";

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
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const conversationIdRef = useRef<string | null>(null);
  const isLoadingConversationRef = useRef(false);
  const isLoadingInitialRef = useRef(false);

  // Modificăm logica de inițializare a conversationId
  const [conversationId, setConversationId] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      // Verificăm dacă avem un ID valid în localStorage
      const saved = localStorage.getItem('currentConversationId');
      // Dacă nu avem ID sau dacă pagina tocmai s-a încărcat (nu din cache),
      // generăm unul nou
      if (!saved || !document.referrer) {
        const newId = crypto.randomUUID();
        localStorage.setItem('currentConversationId', newId);
        conversationIdRef.current = newId;
        return newId;
      }
      conversationIdRef.current = saved;
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
      conversationIdRef.current = conversationId;
    }
  }, [conversationId]);

  // Cleanup effect
  useEffect(() => {
    return () => {
      isLoadingConversationRef.current = false;
      isLoadingInitialRef.current = false;
    };
  }, []);

  // Folosim handleSubmit din useChat
  const { messages, input, handleInputChange, handleSubmit, append, setMessages } = useChat({
    id: conversationId,
    initialMessages,
    body: { conversationId },
    onResponse: (response) => {
      console.log(`Response received for conversation: ${conversationId}`);
      localStorage.setItem('currentConversationId', conversationId);
      setIsThinking(false);
    },
    onFinish: () => {
      console.log(`Response finished for conversation: ${conversationId}`);
      setIsThinking(false);
    },
    onError: (error) => {
      console.error('Chat error:', error);
      setIsThinking(false);
      setError('Failed to send message');
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

  // Load initial messages effect - optimized to prevent loops
  useEffect(() => {
    const loadInitialMessages = async () => {
      if (!conversationId || isLoadingInitialRef.current || isLoadingConversationRef.current) return;
      
      console.log(`Loading initial messages for conversation: ${conversationId}`);
      isLoadingInitialRef.current = true;
      
      try {
        setIsLoading(true);
        const response = await fetch(
          `/api/chat-history?conversationId=${conversationId}`,
          { 
            credentials: 'include',
            headers: { 'Cache-Control': 'no-cache' }
          }
        );
        
        if (response.ok) {
          const history = await response.json();
          const existingConversation = history.find(
            (conv: any) => conv.conversation_id === conversationId
          );
          
          if (existingConversation && existingConversation.messages) {
            // Formatăm mesajele și ne asigurăm că sunt în ordinea corectă
            const formattedMessages = existingConversation.messages
              .map((msg: any) => ({
                id: msg.id || crypto.randomUUID(),
                content: msg.message_content,
                role: msg.role as "user" | "assistant",
                createdAt: new Date(msg.created_at).getTime()
              }))
              .sort((a, b) => a.createdAt - b.createdAt);

            console.log(`Loaded ${formattedMessages.length} initial messages for conversation ${conversationId}`);
            
            // Only update if messages are different to prevent loops
            const currentMessagesString = JSON.stringify(messages.map(m => ({ id: m.id, content: m.content, role: m.role })));
            const newMessagesString = JSON.stringify(formattedMessages.map(m => ({ id: m.id, content: m.content, role: m.role })));
            
            if (currentMessagesString !== newMessagesString) {
              setInitialMessages(formattedMessages);
              setMessages(formattedMessages);
            }
          } else {
            console.log(`No initial messages found for conversation ${conversationId}`);
            if (initialMessages.length > 0 || messages.length > 0) {
              setInitialMessages([]);
              setMessages([]);
            }
          }
        }
      } catch (error) {
        console.error('Failed to load chat history:', error);
        setError('Failed to load chat history');
      } finally {
        setIsLoading(false);
        isLoadingInitialRef.current = false;
      }
    };

    // Add a small delay to prevent rapid successive calls
    const timeoutId = setTimeout(loadInitialMessages, 100);
    return () => clearTimeout(timeoutId);
  }, [conversationId]); // Only depend on conversationId

  const startNewChat = useCallback(async () => {
    setIsStartingNewChat(true);
    
    // Generăm un nou ID de conversație
    const newConversationId = crypto.randomUUID();
    
    // Curățăm localStorage de ID-ul vechi și setăm unul nou
    localStorage.removeItem('currentConversationId');
    localStorage.setItem('currentConversationId', newConversationId);
    
    // Actualizăm conversationId în state
    setConversationId(newConversationId);
    
    // Curățăm mesajele și resetăm starea
    setMessages([]);
    setInitialMessages([]);
    
    setIsStartingNewChat(false);
  }, [setMessages]);

  const handleSelectConversation = useCallback(async (selectedConversationId: string) => {
    if (selectedConversationId === conversationId || isLoadingConversationRef.current) return;
    
    console.log(`Switching to conversation: ${selectedConversationId} from ${conversationId}`);
    
    isLoadingConversationRef.current = true;
    setIsLoading(true);
    setError(null);
    
    try {
      // First, update the conversation ID immediately to prevent multiple clicks
      setConversationId(selectedConversationId);
      conversationIdRef.current = selectedConversationId;
      localStorage.setItem('currentConversationId', selectedConversationId);
      
      // Then load the messages for this conversation
      const response = await fetch(
        `/api/chat-history?conversationId=${selectedConversationId}`,
        { 
          credentials: 'include',
          headers: { 'Cache-Control': 'no-cache' }
        }
      );
      
      if (response.ok) {
        const history = await response.json();
        const existingConversation = history.find(
          (conv: any) => conv.conversation_id === selectedConversationId
        );
        
        if (existingConversation && existingConversation.messages) {
          const formattedMessages = existingConversation.messages
            .map((msg: any) => ({
              id: msg.id || crypto.randomUUID(),
              content: msg.message_content,
              role: msg.role as "user" | "assistant",
              createdAt: new Date(msg.created_at).getTime()
            }))
            .sort((a, b) => a.createdAt - b.createdAt);

          console.log(`Loaded ${formattedMessages.length} messages for conversation ${selectedConversationId}`);
          
          // Clear current messages first, then set new ones
          setMessages([]);
          setInitialMessages([]);
          
          // Use setTimeout to ensure state is cleared before setting new messages
          setTimeout(() => {
            setInitialMessages(formattedMessages);
            setMessages(formattedMessages);
          }, 50);
        } else {
          console.log(`No messages found for conversation ${selectedConversationId}`);
          setInitialMessages([]);
          setMessages([]);
        }
      } else {
        console.error('Failed to fetch conversation history:', response.status);
        setError('Failed to load conversation');
      }
    } catch (error) {
      console.error('Failed to load conversation:', error);
      setError('Failed to load conversation');
    } finally {
      setTimeout(() => {
        setIsLoading(false);
        isLoadingConversationRef.current = false;
      }, 100);
    }
  }, [conversationId, setMessages]);

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
      <ChatHistoryDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onSelectConversation={handleSelectConversation}
        currentConversationId={conversationId}
      />
      
      <div className="w-full flex justify-between items-center p-2 sm:p-4">
        <div className="flex items-center space-x-2">
          <MobileMenuButton
            onClick={() => setIsDrawerOpen(true)}
          />
          <button
            onClick={startNewChat}
            className="px-3 sm:px-4 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center"
            disabled={isStartingNewChat}
          >
            Chat Nou
          </button>
        </div>
        <div className="flex items-center">
          <DisconnectButton />
        </div>
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