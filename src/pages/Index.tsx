
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import Sidebar from '@/components/Sidebar';
import MessageArea from '@/components/MessageArea';
import MessageInput from '@/components/MessageInput';
import { useMessages } from '@/hooks/useMessages';
import { useSettings } from '@/hooks/useSettings';
import { Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SettingsDialog from '@/components/SettingsDialog';

const Index = () => {
  const [selectedThemeId, setSelectedThemeId] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { 
    addMessage, 
    getThemeMessages, 
    getThemeById, 
    resetUnread,
    deleteMessage
  } = useMessages();
  const { settings } = useSettings();

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

  const handleDeleteMessage = (messageId: string) => {
    deleteMessage(messageId);
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
            <div className="p-4 glass-effect flex justify-between items-center">
              <h2 className="text-xl font-medium">{selectedTheme.name}</h2>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsSettingsOpen(true)}
                className="text-muted-foreground hover:text-foreground"
              >
                <Settings size={20} />
              </Button>
            </div>
          )}
          
          <div className="flex-1 overflow-hidden flex flex-col relative">
            <div className="flex-1 overflow-y-auto pb-16">
              <MessageArea 
                messages={themeMessages} 
                theme={selectedTheme}
                onDeleteMessage={handleDeleteMessage}
              />
            </div>
            
            <div className="absolute bottom-0 left-0 right-0">
              <MessageInput 
                onSendMessage={handleSendMessage} 
                disabled={!selectedThemeId} 
              />
            </div>
          </div>
        </div>
      </div>

      <SettingsDialog 
        open={isSettingsOpen} 
        onOpenChange={setIsSettingsOpen} 
      />
    </Layout>
  );
};

export default Index;
