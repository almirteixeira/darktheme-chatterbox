
import React, { useState } from 'react';
import { Send, Square, CheckSquare, Bot } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSettings } from '@/hooks/useSettings';
import { getAiResponse } from '@/services/aiService';
import { useToast } from '@/hooks/use-toast';

interface MessageInputProps {
  onSendMessage: (content: string, isTask: boolean) => void;
  disabled?: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage, disabled }) => {
  const [content, setContent] = useState('');
  const [isTask, setIsTask] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { settings } = useSettings();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim() && !disabled && !isProcessing) {
      onSendMessage(content.trim(), isTask);
      setContent('');
    }
  };

  const toggleTaskStatus = () => {
    setIsTask(!isTask);
  };

  const askAI = async () => {
    if (!content.trim() || disabled || isProcessing) return;
    
    setIsProcessing(true);
    
    // Send user message first
    onSendMessage(content.trim(), isTask);
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
        <button
          type="button"
          onClick={toggleTaskStatus}
          className={cn(
            "p-2 rounded-full transition-colors",
            isTask 
              ? "text-primary hover:bg-primary/10" 
              : "text-muted-foreground hover:bg-accent/50"
          )}
        >
          {isTask ? <CheckSquare size={20} /> : <Square size={20} />}
        </button>
        
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={isTask ? "Adicionar uma tarefa..." : "Escreva uma mensagem..."}
          className="flex-1 bg-accent/50 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 placeholder:text-muted-foreground/70"
          disabled={disabled || isProcessing}
        />
        
        {settings.aiApiKey && (
          <button
            type="button"
            onClick={askAI}
            disabled={!content.trim() || disabled || isProcessing}
            className={cn(
              "p-2 rounded-full transition-colors bg-primary/20 text-primary",
              content.trim() && !isProcessing
                ? "hover:bg-primary/30" 
                : "opacity-50 cursor-not-allowed"
            )}
          >
            <Bot size={20} />
          </button>
        )}
        
        <button
          type="submit"
          disabled={!content.trim() || disabled || isProcessing}
          className={cn(
            "p-2 rounded-full transition-colors bg-primary/20 text-primary",
            content.trim() && !isProcessing
              ? "hover:bg-primary/30" 
              : "opacity-50 cursor-not-allowed"
          )}
        >
          <Send size={20} />
        </button>
      </div>
    </form>
  );
};

export default MessageInput;
