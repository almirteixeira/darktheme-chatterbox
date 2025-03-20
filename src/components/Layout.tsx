
import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { MessageSquare, ListChecks, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isSidebarOpen, setIsSidebarOpen] = useState(!isMobile);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      {/* Mobile Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden glass-effect">
        <div className="flex justify-around items-center h-16">
          <Link 
            to="/" 
            className={cn(
              "flex flex-col items-center justify-center w-full h-full transition-all duration-200 ease-in-out",
              location.pathname === "/" ? "text-primary" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <MessageSquare size={24} />
            <span className="text-xs mt-1">Mensagens</span>
          </Link>
          <Link 
            to="/tasks" 
            className={cn(
              "flex flex-col items-center justify-center w-full h-full transition-all duration-200 ease-in-out",
              location.pathname === "/tasks" ? "text-primary" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <ListChecks size={24} />
            <span className="text-xs mt-1">Tarefas</span>
          </Link>
        </div>
      </div>

      {/* Desktop Side Navigation */}
      <div className={cn(
        "fixed z-50 md:relative h-screen w-64 glass-effect transition-all duration-300 ease-in-out",
        isMobile && (isSidebarOpen ? "left-0" : "-left-64"),
        "hidden md:block"
      )}>
        <div className="flex flex-col h-full p-4">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-xl font-semibold text-foreground">ThemeChat</h1>
            {isMobile && (
              <button 
                onClick={toggleSidebar}
                className="p-1 rounded-md hover:bg-accent/50 transition-colors duration-200"
              >
                <X size={20} />
              </button>
            )}
          </div>
          
          <div className="space-y-2">
            <Link 
              to="/" 
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-md transition-all duration-200 ease-in-out",
                location.pathname === "/" 
                  ? "bg-accent text-foreground" 
                  : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
              )}
            >
              <MessageSquare size={20} />
              <span>Mensagens</span>
            </Link>
            <Link 
              to="/tasks" 
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-md transition-all duration-200 ease-in-out",
                location.pathname === "/tasks" 
                  ? "bg-accent text-foreground" 
                  : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
              )}
            >
              <ListChecks size={20} />
              <span>Tarefas</span>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Mobile sidebar toggle */}
      {isMobile && (
        <button 
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-50 p-2 rounded-md glass-effect md:hidden"
        >
          <Menu size={20} />
        </button>
      )}

      {/* Mobile sidebar overlay */}
      {isMobile && isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/70 z-40 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Mobile sidebar */}
      {isMobile && (
        <div className={cn(
          "fixed top-0 z-50 h-screen w-64 glass-effect transition-all duration-300 ease-in-out",
          isSidebarOpen ? "left-0" : "-left-64"
        )}>
          <div className="flex flex-col h-full p-4">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-xl font-semibold text-foreground">ThemeChat</h1>
              <button 
                onClick={toggleSidebar}
                className="p-1 rounded-md hover:bg-accent/50 transition-colors duration-200"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-2">
              <Link 
                to="/" 
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-md transition-all duration-200 ease-in-out",
                  location.pathname === "/" 
                    ? "bg-accent text-foreground" 
                    : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                )}
                onClick={isMobile ? toggleSidebar : undefined}
              >
                <MessageSquare size={20} />
                <span>Mensagens</span>
              </Link>
              <Link 
                to="/tasks" 
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-md transition-all duration-200 ease-in-out",
                  location.pathname === "/tasks" 
                    ? "bg-accent text-foreground" 
                    : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                )}
                onClick={isMobile ? toggleSidebar : undefined}
              >
                <ListChecks size={20} />
                <span>Tarefas</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-x-hidden relative md:ml-4 pb-16 md:pb-0">
        {children}
      </main>
    </div>
  );
};

export default Layout;
