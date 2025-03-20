
import React, { useState } from 'react';
import { Plus, Folder, Tag, Briefcase, Heart, User, Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useMessages } from '@/hooks/useMessages';
import { ThemeType } from '@/types';

interface SidebarProps {
  selectedTheme: string | null;
  onSelectTheme: (themeId: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ selectedTheme, onSelectTheme }) => {
  const { themes, addTheme } = useMessages();
  const [newThemeInput, setNewThemeInput] = useState("");
  const [isAddingTheme, setIsAddingTheme] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  const handleAddTheme = () => {
    if (newThemeInput.trim()) {
      addTheme(newThemeInput.trim());
      setNewThemeInput("");
      setIsAddingTheme(false);
    }
  };

  const getThemeIcon = (theme: ThemeType) => {
    switch (theme.name.toLowerCase()) {
      case 'trabalho':
        return <Briefcase size={18} />;
      case 'saúde':
      case 'saude':
        return <Heart size={18} />;
      case 'pessoal':
        return <User size={18} />;
      default:
        return <Tag size={18} />;
    }
  };

  const filteredThemes = themes.filter(theme => 
    theme.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col overflow-hidden py-2">
      <div className="px-3 pb-2">
        <div className="relative mb-3">
          <Search className="absolute top-3 left-3 text-muted-foreground w-4 h-4" />
          <input
            type="text"
            placeholder="Buscar temas..."
            className="w-full bg-accent/50 text-sm rounded-md py-2 pl-9 pr-3 focus:outline-none focus:ring-1 focus:ring-primary/50 placeholder:text-muted-foreground/70"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button
          onClick={() => setIsAddingTheme(true)}
          className="flex items-center gap-2 w-full px-3 py-2 text-sm text-primary rounded-md hover:bg-accent/50 transition-colors"
        >
          <Plus size={18} />
          <span>Novo tema</span>
        </button>
      </div>

      {isAddingTheme && (
        <div className="mx-3 mb-3 p-3 bg-accent/50 rounded-md animate-scale-in">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium">Novo tema</h3>
            <button 
              onClick={() => setIsAddingTheme(false)} 
              className="text-muted-foreground hover:text-foreground"
            >
              <X size={16} />
            </button>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Nome do tema"
              className="flex-1 bg-accent text-sm rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary/50"
              value={newThemeInput}
              onChange={(e) => setNewThemeInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddTheme()}
              autoFocus
            />
            <button 
              onClick={handleAddTheme}
              className="bg-primary/20 hover:bg-primary/30 text-primary-foreground px-3 py-1 rounded-md text-sm transition-colors"
            >
              Adicionar
            </button>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto scrollbar-none px-2">
        <div className="space-y-1">
          {filteredThemes.length > 0 ? (
            filteredThemes.map((theme) => (
              <button
                key={theme.id}
                onClick={() => onSelectTheme(theme.id)}
                className={cn(
                  "w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-all duration-200",
                  selectedTheme === theme.id
                    ? "bg-accent text-foreground" 
                    : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                )}
              >
                {getThemeIcon(theme)}
                <span className="truncate">{theme.name}</span>
                {theme.unread > 0 && (
                  <span className="ml-auto flex items-center justify-center min-w-5 h-5 text-xs bg-primary/20 text-primary rounded-full px-1.5">
                    {theme.unread}
                  </span>
                )}
              </button>
            ))
          ) : (
            <div className="px-3 py-6 text-center text-sm text-muted-foreground">
              <Folder className="mx-auto mb-2 text-muted-foreground/50" />
              {searchQuery 
                ? "Nenhum tema encontrado" 
                : "Nenhum tema criado ainda"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
