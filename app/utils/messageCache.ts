const CACHE_KEY = 'chat_messages_cache';

export const cacheMessages = (conversationId: string, messages: any[]) => {
  try {
    const cache = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');
    cache[conversationId] = messages;
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch (error) {
    console.error('Error caching messages:', error);
  }
};

export const getCachedMessages = (conversationId: string) => {
  try {
    const cache = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');
    return cache[conversationId] || [];
  } catch (error) {
    console.error('Error reading cached messages:', error);
    return [];
  }
}; 