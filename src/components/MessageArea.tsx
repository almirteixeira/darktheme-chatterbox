
import React, { useEffect, useRef } from 'react';
import { CheckCircle2, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MessageType, ThemeType } from '@/types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface MessageAreaProps {
  messages: MessageType[];
  theme: ThemeType | null;
}

const MessageArea: React.FC<MessageAreaProps> = ({ messages, theme }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (!theme) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-24 h-24 bg-accent/50 rounded-full flex items-center justify-center mb-4">
          <Clock size={40} className="text-muted-foreground" />
        </div>
        <h3 className="text-xl font-medium mb-2">Nenhum tema selecionado</h3>
        <p className="text-muted-foreground max-w-md">
          Selecione um tema existente ou crie um novo para começar a conversar
        </p>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-24 h-24 bg-accent/50 rounded-full flex items-center justify-center mb-4">
          <Clock size={40} className="text-muted-foreground" />
        </div>
        <h3 className="text-xl font-medium mb-2">Nenhuma mensagem ainda</h3>
        <p className="text-muted-foreground max-w-md">
          Comece a enviar mensagens para o tema <span className="text-foreground font-medium">{theme.name}</span>
        </p>
      </div>
    );
  }

  // Group messages by date
  const groupedMessages: { [key: string]: MessageType[] } = {};
  
  messages.forEach(message => {
    const date = new Date(message.timestamp);
    const dateKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    
    if (!groupedMessages[dateKey]) {
      groupedMessages[dateKey] = [];
    }
    
    groupedMessages[dateKey].push(message);
  });

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {Object.entries(groupedMessages).map(([dateKey, dayMessages]) => {
        const date = new Date(dayMessages[0].timestamp);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        
        let dateDisplay;
        if (
          date.getDate() === today.getDate() &&
          date.getMonth() === today.getMonth() &&
          date.getFullYear() === today.getFullYear()
        ) {
          dateDisplay = 'Hoje';
        } else if (
          date.getDate() === yesterday.getDate() &&
          date.getMonth() === yesterday.getMonth() &&
          date.getFullYear() === yesterday.getFullYear()
        ) {
          dateDisplay = 'Ontem';
        } else {
          dateDisplay = format(date, "dd 'de' MMMM", { locale: ptBR });
        }
        
        return (
          <div key={dateKey} className="space-y-4">
            <div className="flex justify-center">
              <div className="bg-accent/50 px-3 py-1 rounded-full text-xs text-muted-foreground">
                {dateDisplay}
              </div>
            </div>
            
            {dayMessages.map((message) => (
              <div 
                key={message.id} 
                className={cn(
                  "max-w-[80%] rounded-2xl px-4 py-2 animate-slide-in",
                  message.isTask 
                    ? "bg-primary/20 border border-primary/10" 
                    : "bg-accent/80 backdrop-blur-sm"
                )}
              >
                <div className="flex items-start gap-2">
                  {message.isTask && (
                    <div className="mt-1 text-primary">
                      <CheckCircle2 size={16} />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-balance break-words">{message.content}</p>
                    <div className="flex justify-between items-center mt-1">
                      <div className="flex items-center gap-1">
                        {message.isTask && (
                          <span className="text-xs font-medium text-primary">
                            Tarefa
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(message.timestamp), 'HH:mm')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageArea;
