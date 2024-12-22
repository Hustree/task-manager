import { Task, SortOption } from '../types';
import { startOfDay, endOfDay, parseISO } from 'date-fns';

export const sortTasks = (tasks: Task[], sortBy: SortOption): Task[] => {
  return [...tasks].sort((a, b) => {
    switch (sortBy) {
      case 'priority':
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      case 'dueDate':
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      case 'alphabetical':
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });
};

export const getInitialTasks = (): Task[] => {
  const storedTasks = localStorage.getItem('tasks');
  return storedTasks ? JSON.parse(storedTasks) : [
    { id: 1, title: "Some React Learning", completed: false, priority: 'medium', important: false, list: 'tasks' },
    { id: 2, title: "Google Cert - UI / UX - Module 5", completed: false, priority: 'high', dueDate: '2023-12-31', important: true, list: 'tasks' },
    { id: 3, title: "eYvent some initial progress", completed: false, priority: 'low', important: false, list: 'tasks' }
  ];
};

export const filterTasks = (tasks: Task[], view: string): Task[] => {
  const today = new Date();
  switch (view) {
    case 'myDay':
      return tasks.filter(task => {
        if (!task.dueDate) return false;
        const taskDate = parseISO(task.dueDate);
        return taskDate >= startOfDay(today) && taskDate <= endOfDay(today);
      });
    case 'important':
      return tasks.filter(task => task.important);
    case 'planned':
      return tasks.filter(task => task.dueDate);
    case 'assigned':
      // Placeholder for assigned tasks (you might implement this differently)
      return tasks;
    case 'flagged':
      // Placeholder for flagged tasks (you might implement this differently)
      return tasks.filter(task => task.important);
    case 'tasks':
      return tasks.filter(task => task.list === 'tasks');
    default:
      return tasks.filter(task => task.list === view);
  }
};

