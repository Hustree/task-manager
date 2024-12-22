export interface Task {
  id: number;
  title: string;
  completed: boolean;
  dueDate?: string;
  priority: 'low' | 'medium' | 'high';
  important: boolean;
  list: string;
}

export type SortOption = 'priority' | 'dueDate' | 'alphabetical';

export type View = 'myDay' | 'important' | 'planned' | 'assigned' | 'flagged' | 'tasks' | 'list';

