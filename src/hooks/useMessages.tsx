
import { useState, useEffect, useCallback } from 'react';
import { MessageType, ThemeType } from '@/types';

// Local Storage Keys
const THEMES_STORAGE_KEY = 'themechat-themes';
const MESSAGES_STORAGE_KEY = 'themechat-messages';

export const useMessages = () => {
  // Initialize themes from localStorage or with defaults
  const [themes, setThemes] = useState<ThemeType[]>(() => {
    const savedThemes = localStorage.getItem(THEMES_STORAGE_KEY);
    if (savedThemes) {
      return JSON.parse(savedThemes);
    } else {
      // Default themes
      const defaultThemes = [
        { id: 'theme-work', name: 'Trabalho', unread: 0 },
        { id: 'theme-health', name: 'Saúde', unread: 0 },
        { id: 'theme-personal', name: 'Pessoal', unread: 0 },
      ];
      return defaultThemes;
    }
  });

  // Initialize messages from localStorage
  const [messages, setMessages] = useState<MessageType[]>(() => {
    const savedMessages = localStorage.getItem(MESSAGES_STORAGE_KEY);
    return savedMessages ? JSON.parse(savedMessages) : [];
  });

  // Save to localStorage whenever messages or themes change
  useEffect(() => {
    localStorage.setItem(THEMES_STORAGE_KEY, JSON.stringify(themes));
  }, [themes]);

  useEffect(() => {
    localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  // Add a new theme
  const addTheme = useCallback((name: string) => {
    const newTheme: ThemeType = {
      id: `theme-${Date.now()}`,
      name,
      unread: 0,
    };
    setThemes(prev => [...prev, newTheme]);
    return newTheme.id;
  }, []);

  // Add a message to a theme
  const addMessage = useCallback((content: string, themeId: string, isTask: boolean) => {
    const newMessage: MessageType = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      content,
      timestamp: Date.now(),
      themeId,
      isTask,
      completed: false,
    };
    
    setMessages(prev => [...prev, newMessage]);
    
    // Update unread count for the theme
    setThemes(prev => 
      prev.map(theme => 
        theme.id === themeId
          ? { ...theme, unread: theme.unread + 1 }
          : theme
      )
    );
    
    return newMessage;
  }, []);

  // Reset unread count for a theme
  const resetUnread = useCallback((themeId: string) => {
    setThemes(prev => 
      prev.map(theme => 
        theme.id === themeId
          ? { ...theme, unread: 0 }
          : theme
      )
    );
  }, []);

  // Toggle task completion status
  const toggleTaskCompletion = useCallback((taskId: string) => {
    setMessages(prev => 
      prev.map(message => 
        message.id === taskId
          ? { ...message, completed: !message.completed }
          : message
      )
    );
  }, []);

  // Delete a message
  const deleteMessage = useCallback((messageId: string) => {
    setMessages(prev => prev.filter(message => message.id !== messageId));
  }, []);

  // Get messages for a specific theme
  const getThemeMessages = useCallback((themeId: string | null) => {
    if (!themeId) return [];
    return messages.filter(message => message.themeId === themeId);
  }, [messages]);

  // Get all tasks (messages with isTask=true)
  const getAllTasks = useCallback(() => {
    return messages.filter(message => message.isTask);
  }, [messages]);

  // Get a theme by ID
  const getThemeById = useCallback((themeId: string | null) => {
    if (!themeId) return null;
    return themes.find(theme => theme.id === themeId) || null;
  }, [themes]);

  return {
    themes,
    messages,
    addTheme,
    addMessage,
    resetUnread,
    toggleTaskCompletion,
    deleteMessage,
    getThemeMessages,
    getAllTasks,
    getThemeById
  };
};
