import { Task, SortOption, View } from '../types';
import { TaskItem } from './TaskItem';
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import { Plus, ChevronRight, ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface TaskListProps {
  tasks: Task[];
  completedTasks: Task[];
  onToggleComplete: (id: number) => void;
  onDelete: (id: number) => void;
  onEdit: (id: number, newTitle: string) => void;
  onUpdateDueDate: (id: number, newDate: Date | undefined) => void;
  onUpdatePriority: (id: number, newPriority: Task['priority']) => void;
  onToggleImportant: (id: number) => void;
  onAddTask: (title: string) => void;
  sortBy: SortOption;
  onSortChange: (value: SortOption) => void;
  currentView: View;
}

export function TaskList({
  tasks,
  completedTasks,
  onToggleComplete,
  onDelete,
  onEdit,
  onUpdateDueDate,
  onUpdatePriority,
  onToggleImportant,
  onAddTask,
  sortBy,
  onSortChange,
  currentView
}: TaskListProps) {
  const [newTask, setNewTask] = useState("");
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [showCompleted, setShowCompleted] = useState(false);

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTask.trim()) {
      onAddTask(newTask.trim());
      setNewTask("");
      setIsAddingTask(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">{currentView.charAt(0).toUpperCase() + currentView.slice(1)}</h2>
        <Select value={sortBy} onValueChange={(value: SortOption) => onSortChange(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="priority">Sort by Priority</SelectItem>
            <SelectItem value="dueDate">Sort by Due Date</SelectItem>
            <SelectItem value="alphabetical">Sort Alphabetically</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1">
        {tasks.map(task => (
          <TaskItem
            key={task.id}
            task={task}
            onToggleComplete={onToggleComplete}
            onDelete={onDelete}
            onEdit={onEdit}
            onUpdateDueDate={onUpdateDueDate}
            onUpdatePriority={onUpdatePriority}
            onToggleImportant={onToggleImportant}
          />
        ))}
      </div>

      {isAddingTask ? (
        <form onSubmit={handleAddTask} className="mt-4">
          <Input
            autoFocus
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Enter task name"
            className="w-full bg-gray-800 border-0"
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                setIsAddingTask(false);
                setNewTask('');
              }
            }}
          />
        </form>
      ) : (
        <Button 
          variant="ghost" 
          className="w-full justify-start gap-3 mt-4 text-blue-500 hover:text-blue-400"
          onClick={() => setIsAddingTask(true)}
        >
          <Plus className="w-4 h-4" /> Add a task
        </Button>
      )}

      {completedTasks.length > 0 && (
        <div className="mt-4">
          <Button 
            variant="ghost" 
            className="w-full justify-start gap-2 text-gray-400"
            onClick={() => setShowCompleted(!showCompleted)}
          >
            {showCompleted ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            Completed {completedTasks.length}
          </Button>
          
          {showCompleted && (
            <div className="space-y-1 mt-1">
              {completedTasks.map(task => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggleComplete={onToggleComplete}
                  onDelete={onDelete}
                  onEdit={onEdit}
                  onUpdateDueDate={onUpdateDueDate}
                  onUpdatePriority={onUpdatePriority}
                  onToggleImportant={onToggleImportant}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

