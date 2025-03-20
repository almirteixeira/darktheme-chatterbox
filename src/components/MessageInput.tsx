
import React, { useState } from 'react';
import { Send, Square, CheckSquare, Bot, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSettings } from '@/hooks/useSettings';
import { getAiResponse } from '@/services/aiService';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type MessageMode = 'regular' | 'task' | 'ai';

interface MessageInputProps {
  onSendMessage: (content: string, isTask: boolean) => void;
  disabled?: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage, disabled }) => {
  const [content, setContent] = useState('');
  const [messageMode, setMessageMode] = useState<MessageMode>('regular');
  const [isProcessing, setIsProcessing] = useState(false);
  const { settings } = useSettings();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim() && !disabled && !isProcessing) {
      if (messageMode === 'ai') {
        await askAI();
      } else {
        onSendMessage(content.trim(), messageMode === 'task');
        setContent('');
      }
    }
  };

  const handleModeChange = (mode: MessageMode) => {
    setMessageMode(mode);
  };

  const getModeIcon = () => {
    switch (messageMode) {
      case 'task':
        return <CheckSquare size={20} />;
      case 'ai':
        return <Bot size={20} />;
      default:
        return <MessageCircle size={20} />;
    }
  };

  const getPlaceholder = () => {
    switch (messageMode) {
      case 'task':
        return 'Adicionar uma tarefa...';
      case 'ai':
        return 'Perguntar à IA...';
      default:
        return 'Escreva uma mensagem...';
    }
  };

  const askAI = async () => {
    if (!content.trim() || disabled || isProcessing) return;
    
    setIsProcessing(true);
    
    // Send user message first
    onSendMessage(content.trim(), false);
    const userMessage = content;
    setContent('');
    
    try {
      const response = await getAiResponse(userMessage, settings);
      
      if (response.error) {
        toast({
          title: 'Erro da IA',
          description: response.error,
          variant: 'destructive',
        });
      } else if (response.content) {
        // Send AI response as a new message
        onSendMessage(response.content, false);
      }
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível obter resposta da IA',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className={cn(
        "p-3 glass-effect transition-all duration-300 z-10 sticky bottom-0",
        disabled && "opacity-60 pointer-events-none"
      )}
    >
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className={cn(
                "p-2 rounded-full transition-colors",
                messageMode === 'task' 
                  ? "text-amber-500 hover:bg-amber-500/10" 
                  : messageMode === 'ai'
                    ? "text-blue-500 hover:bg-blue-500/10"
                    : "text-green-500 hover:bg-green-500/10"
              )}
            >
              {getModeIcon()}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem onClick={() => handleModeChange('regular')}>
              <MessageCircle className="mr-2 h-4 w-4 text-green-500" />
              <span>Mensagem</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleModeChange('task')}>
              <CheckSquare className="mr-2 h-4 w-4 text-amber-500" />
              <span>Tarefa</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleModeChange('ai')}>
              <Bot className="mr-2 h-4 w-4 text-blue-500" />
              <span>Perguntar à IA</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={getPlaceholder()}
          className="flex-1 bg-accent/50 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 placeholder:text-muted-foreground/70"
          disabled={disabled || isProcessing}
        />
        
        <button
          type="submit"
          disabled={!content.trim() || disabled || isProcessing}
          className={cn(
            "p-2 rounded-full transition-colors",
            messageMode === 'ai' 
              ? "bg-blue-500/20 text-blue-500 hover:bg-blue-500/30" 
              : messageMode === 'task'
                ? "bg-amber-500/20 text-amber-500 hover:bg-amber-500/30"
                : "bg-green-500/20 text-green-500 hover:bg-green-500/30",
            (!content.trim() || disabled || isProcessing) && "opacity-50 cursor-not-allowed"
          )}
        >
          <Send size={20} />
        </button>
      </div>
    </form>
  );
};

export default MessageInput;
