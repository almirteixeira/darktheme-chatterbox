
import React, { useState } from 'react';
import { CheckCircle2, Circle, X, Tag, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MessageType, ThemeType } from '@/types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface TaskViewProps {
  tasks: MessageType[];
  themes: ThemeType[];
  onToggleTaskCompletion: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
}

const TaskView: React.FC<TaskViewProps> = ({ 
  tasks, 
  themes, 
  onToggleTaskCompletion, 
  onDeleteTask 
}) => {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showCompletedTasks, setShowCompletedTasks] = useState(true);

  // Filter tasks by theme and completed status
  const filteredTasks = tasks.filter(task => {
    const matchesTheme = activeFilter ? task.themeId === activeFilter : true;
    const matchesCompletion = showCompletedTasks ? true : !task.completed;
    const matchesSearch = task.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTheme && matchesCompletion && matchesSearch;
  });

  // Group tasks by theme
  const groupedTasks: { [key: string]: MessageType[] } = {};
  
  filteredTasks.forEach(task => {
    if (!groupedTasks[task.themeId]) {
      groupedTasks[task.themeId] = [];
    }
    
    groupedTasks[task.themeId].push(task);
  });

  // Get theme name by ID
  const getThemeName = (themeId: string) => {
    const theme = themes.find(t => t.id === themeId);
    return theme ? theme.name : 'Sem tema';
  };

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center">
        <div className="w-24 h-24 bg-accent/50 rounded-full flex items-center justify-center mb-4">
          <CheckCircle2 size={40} className="text-muted-foreground" />
        </div>
        <h3 className="text-xl font-medium mb-2">Nenhuma tarefa ainda</h3>
        <p className="text-muted-foreground max-w-md">
          Marque mensagens como tarefas para começar a construir sua lista
        </p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 glass-effect">
        <div className="relative mb-4">
          <Search className="absolute top-3 left-3 text-muted-foreground w-4 h-4" />
          <input
            type="text"
            placeholder="Buscar tarefas..."
            className="w-full bg-accent/50 text-sm rounded-md py-2 pl-9 pr-3 focus:outline-none focus:ring-1 focus:ring-primary/50 placeholder:text-muted-foreground/70"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveFilter(null)}
            className={cn(
              "text-xs px-3 py-1.5 rounded-full transition-colors",
              activeFilter === null 
                ? "bg-primary/20 text-primary" 
                : "bg-accent/70 text-muted-foreground hover:bg-accent"
            )}
          >
            Todas
          </button>
          
          {themes.map(theme => (
            <button
              key={theme.id}
              onClick={() => setActiveFilter(activeFilter === theme.id ? null : theme.id)}
              className={cn(
                "text-xs px-3 py-1.5 rounded-full flex items-center gap-1 transition-colors",
                activeFilter === theme.id 
                  ? "bg-primary/20 text-primary" 
                  : "bg-accent/70 text-muted-foreground hover:bg-accent"
              )}
            >
              <Tag size={12} />
              <span>{theme.name}</span>
            </button>
          ))}
          
          <button
            onClick={() => setShowCompletedTasks(!showCompletedTasks)}
            className={cn(
              "text-xs px-3 py-1.5 rounded-full transition-colors ml-auto",
              showCompletedTasks 
                ? "bg-accent/70 text-muted-foreground hover:bg-accent" 
                : "bg-primary/20 text-primary"
            )}
          >
            {showCompletedTasks ? "Ocultar concluídas" : "Mostrar concluídas"}
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {Object.keys(groupedTasks).length > 0 ? (
          Object.entries(groupedTasks).map(([themeId, themeTasks]) => (
            <div key={themeId} className="space-y-2">
              <div className="flex items-center gap-2 mb-3">
                <h3 className="text-sm font-medium">{getThemeName(themeId)}</h3>
                <div className="h-[1px] flex-1 bg-accent/50"></div>
              </div>
              
              <div className="space-y-2">
                {themeTasks.map(task => (
                  <div 
                    key={task.id}
                    className={cn(
                      "group flex items-start gap-3 p-3 rounded-lg transition-all",
                      task.completed 
                        ? "bg-accent/30" 
                        : "bg-accent/70 hover:bg-accent"
                    )}
                  >
                    <button
                      onClick={() => onToggleTaskCompletion(task.id)}
                      className={cn(
                        "mt-0.5 flex-shrink-0 transition-colors",
                        task.completed ? "text-primary" : "text-muted-foreground"
                      )}
                    >
                      {task.completed ? <CheckCircle2 size={18} /> : <Circle size={18} />}
                    </button>
                    
                    <div className="flex-1 min-w-0">
                      <p className={cn(
                        "text-sm text-balance break-words transition-all",
                        task.completed && "text-muted-foreground line-through"
                      )}>
                        {task.content}
                      </p>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(task.timestamp), "dd 'de' MMM 'às' HH:mm", { locale: ptBR })}
                        </span>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => onDeleteTask(task.id)}
                      className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-opacity mt-0.5"
                    >
                      <X size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <p className="text-sm text-muted-foreground">
              {searchQuery 
                ? "Nenhuma tarefa encontrada para a busca atual" 
                : activeFilter 
                  ? "Nenhuma tarefa nesta categoria" 
                  : "Nenhuma tarefa encontrada"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskView;
