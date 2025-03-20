
import React from 'react';
import Layout from '@/components/Layout';
import TaskView from '@/components/TaskView';
import { useMessages } from '@/hooks/useMessages';

const Tasks = () => {
  const { 
    getAllTasks, 
    themes, 
    toggleTaskCompletion, 
    deleteMessage 
  } = useMessages();

  const tasks = getAllTasks();

  return (
    <Layout>
      <div className="h-full">
        <div className="p-4 glass-effect">
          <h2 className="text-xl font-medium">Tarefas</h2>
        </div>
        
        <div className="h-[calc(100%-4rem)]">
          <TaskView 
            tasks={tasks} 
            themes={themes} 
            onToggleTaskCompletion={toggleTaskCompletion} 
            onDeleteTask={deleteMessage} 
          />
        </div>
      </div>
    </Layout>
  );
};

export default Tasks;
