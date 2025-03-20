
import React, { useState } from 'react';
import { Send, Square, CheckSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MessageInputProps {
  onSendMessage: (content: string, isTask: boolean) => void;
  disabled?: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage, disabled }) => {
  const [content, setContent] = useState('');
  const [isTask, setIsTask] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim() && !disabled) {
      onSendMessage(content.trim(), isTask);
      setContent('');
    }
  };

  const toggleTaskStatus = () => {
    setIsTask(!isTask);
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className={cn(
        "p-3 glass-effect transition-all duration-300 z-10",
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
          disabled={disabled}
        />
        
        <button
          type="submit"
          disabled={!content.trim() || disabled}
          className={cn(
            "p-2 rounded-full transition-colors bg-primary/20 text-primary",
            content.trim() 
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
