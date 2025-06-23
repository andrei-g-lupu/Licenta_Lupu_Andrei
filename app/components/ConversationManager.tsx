import React from 'react';

interface Conversation {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: string;
}

interface ConversationManagerProps {
  conversations: Conversation[];
  currentConversationId: string;
  onConversationSelect: (id: string) => void;
  onDeleteConversation: (id: string) => void;
}

const ConversationManager: React.FC<ConversationManagerProps> = ({
  conversations,
  currentConversationId,
  onConversationSelect,
  onDeleteConversation
}) => {
  return (
    <div className="w-64 border-r border-gray-200 p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold">Conversations</h2>
        <button className="text-blue-600 hover:text-blue-800">
          New Chat
        </button>
      </div>
      <div className="space-y-2">
        {conversations.map((conv) => (
          <div
            key={conv.id}
            className={`p-2 rounded-lg cursor-pointer ${
              conv.id === currentConversationId
                ? 'bg-blue-50 border-blue-200'
                : 'hover:bg-gray-50'
            }`}
            onClick={() => onConversationSelect(conv.id)}
          >
            <div className="font-medium truncate">{conv.title}</div>
            <div className="text-sm text-gray-500 truncate">
              {conv.lastMessage}
            </div>
            <div className="text-xs text-gray-400">{conv.timestamp}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConversationManager; 