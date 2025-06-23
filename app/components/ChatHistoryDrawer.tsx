"use client"
import React, { useState, useEffect } from 'react';
import { X, MessageSquare, Clock, ChevronRight } from 'lucide-react';

interface ChatMessage {
  id: string;
  message_content: string;
  role: 'user' | 'assistant';
  created_at: string;
}

interface ChatConversation {
  conversation_id: string;
  messages: ChatMessage[];
}

interface ChatHistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectConversation: (conversationId: string) => void;
  currentConversationId?: string;
}

const ChatHistoryDrawer: React.FC<ChatHistoryDrawerProps> = ({
  isOpen,
  onClose,
  onSelectConversation,
  currentConversationId
}) => {
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchChatHistory();
    }
  }, [isOpen]);

  const fetchChatHistory = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/chat-history?limit=20', {
        credentials: 'include',
        headers: { 'Cache-Control': 'no-cache' }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch chat history');
      }
      
      const data = await response.json();
      setConversations(data);
    } catch (err) {
      setError('Failed to load chat history');
      console.error('Error fetching chat history:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString('ro-RO', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } else if (diffInHours < 24 * 7) {
      return date.toLocaleDateString('ro-RO', { 
        weekday: 'short',
        hour: '2-digit',
        minute: '2-digit'
      });
    } else {
      return date.toLocaleDateString('ro-RO', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit'
      });
    }
  };

  const getConversationPreview = (messages: ChatMessage[]) => {
    if (!messages || messages.length === 0) return 'Conversație nouă';
    
    // Find the first user message
    const firstUserMessage = messages.find(msg => msg.role === 'user');
    if (firstUserMessage) {
      return firstUserMessage.message_content.length > 50 
        ? firstUserMessage.message_content.substring(0, 50) + '...'
        : firstUserMessage.message_content;
    }
    
    return 'Conversație nouă';
  };

  const getLastMessageTime = (messages: ChatMessage[]) => {
    if (!messages || messages.length === 0) return new Date().toISOString();
    
    // Sort messages by created_at and get the latest
    const sortedMessages = [...messages].sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    
    return sortedMessages[0].created_at;
  };

  const handleConversationClick = async (conversationId: string) => {
    if (isSelecting || selectedConversationId === conversationId) return;
    
    console.log(`ChatHistoryDrawer: Selecting conversation ${conversationId}`);
    
    setIsSelecting(true);
    setSelectedConversationId(conversationId);
    
    try {
      await onSelectConversation(conversationId);
      // Close drawer after successful selection
      setTimeout(() => {
        onClose();
      }, 100);
    } catch (error) {
      console.error('Failed to select conversation:', error);
    } finally {
      setTimeout(() => {
        setIsSelecting(false);
        setSelectedConversationId(null);
      }, 500);
    }
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
          onClick={onClose}
        />
      )}
      
      {/* Drawer */}
      <div className={`
        fixed top-0 left-0 h-full w-80 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <MessageSquare className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-800">Istoric Conversații</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="p-4 text-center">
              <p className="text-red-500 text-sm">{error}</p>
              <button
                onClick={fetchChatHistory}
                className="mt-2 px-4 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                Încearcă din nou
              </button>
            </div>
          ) : conversations.length === 0 ? (
            <div className="p-4 text-center">
              <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">Nu există conversații anterioare</p>
            </div>
          ) : (
            <div className="p-2">
              {conversations.map((conversation) => (
                <div
                  key={conversation.conversation_id}
                  onClick={() => handleConversationClick(conversation.conversation_id)}
                  className={`
                    p-3 mb-2 rounded-lg cursor-pointer transition-all duration-200 hover:bg-gray-50 border relative
                    ${currentConversationId === conversation.conversation_id 
                      ? 'bg-blue-50 border-blue-200' 
                      : 'bg-white border-gray-100 hover:border-gray-200'
                    }
                    ${isSelecting && selectedConversationId === conversation.conversation_id 
                      ? 'opacity-50 cursor-not-allowed' 
                      : ''
                    }
                    ${isSelecting && selectedConversationId !== conversation.conversation_id 
                      ? 'opacity-30 cursor-not-allowed' 
                      : ''
                    }
                  `}
                  style={{ 
                    pointerEvents: isSelecting ? 'none' : 'auto' 
                  }}
                >
                  {isSelecting && selectedConversationId === conversation.conversation_id && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 rounded-lg">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                    </div>
                  )}
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">
                        {getConversationPreview(conversation.messages)}
                      </p>
                      <div className="flex items-center mt-1 text-xs text-gray-500">
                        <Clock className="w-3 h-3 mr-1" />
                        {formatDate(getLastMessageTime(conversation.messages))}
                        <span className="ml-2">
                          {conversation.messages?.length || 0} mesaje
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0 ml-2" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4">
          <button
            onClick={fetchChatHistory}
            className="w-full px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
          >
            Reîmprospătează
          </button>
        </div>
      </div>
    </>
  );
};

export default ChatHistoryDrawer; 