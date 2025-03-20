
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import Sidebar from '@/components/Sidebar';
import MessageArea from '@/components/MessageArea';
import MessageInput from '@/components/MessageInput';
import { useMessages } from '@/hooks/useMessages';

const Index = () => {
  const [selectedThemeId, setSelectedThemeId] = useState<string | null>(null);
  const { 
    addMessage, 
    getThemeMessages, 
    getThemeById, 
    resetUnread 
  } = useMessages();

  const themeMessages = getThemeMessages(selectedThemeId);
  const selectedTheme = getThemeById(selectedThemeId);

  // Reset unread count when a theme is selected
  useEffect(() => {
    if (selectedThemeId) {
      resetUnread(selectedThemeId);
    }
  }, [selectedThemeId, resetUnread]);

  const handleSelectTheme = (themeId: string) => {
    setSelectedThemeId(themeId);
  };

  const handleSendMessage = (content: string, isTask: boolean) => {
    if (selectedThemeId) {
      addMessage(content, selectedThemeId, isTask);
    }
  };

  return (
    <Layout>
      <div className="flex h-full">
        <div className="hidden md:block w-72 h-full border-r border-accent/50">
          <Sidebar 
            selectedTheme={selectedThemeId} 
            onSelectTheme={handleSelectTheme} 
          />
        </div>
        
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          {selectedTheme && (
            <div className="p-4 glass-effect">
              <h2 className="text-xl font-medium">{selectedTheme.name}</h2>
            </div>
          )}
          
          <div className="flex-1 overflow-hidden flex flex-col">
            <MessageArea 
              messages={themeMessages} 
              theme={selectedTheme} 
            />
            
            <MessageInput 
              onSendMessage={handleSendMessage} 
              disabled={!selectedThemeId} 
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
