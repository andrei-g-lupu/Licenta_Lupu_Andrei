export const backupMessages = (conversationId: string, messages: any[]) => {
  try {
    localStorage.setItem(`chat_backup_${conversationId}`, JSON.stringify(messages));
  } catch (error) {
    console.error('Error backing up messages:', error);
  }
};

export const getBackupMessages = (conversationId: string) => {
  try {
    const backup = localStorage.getItem(`chat_backup_${conversationId}`);
    return backup ? JSON.parse(backup) : [];
  } catch (error) {
    console.error('Error retrieving backup messages:', error);
    return [];
  }
}; 