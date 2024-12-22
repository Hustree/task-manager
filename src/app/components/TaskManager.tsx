'use client'

import { useState, useEffect } from 'react'
import { Task, SortOption, View } from '../types'
import { Sidebar } from './Sidebar'
import { TaskList } from './TaskList'
import { sortTasks, getInitialTasks, filterTasks } from '../utils/taskUtils'
import { Toaster } from "@/app/components/ui/toaster"
import { useToast } from "@/hooks/use-toast"

export default function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>(getInitialTasks)
  const [sortBy, setSortBy] = useState<SortOption>('priority')
  const [currentView, setCurrentView] = useState<View>('tasks')
  const { toast } = useToast()

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks))
  }, [tasks])

  const filteredTasks = filterTasks(tasks, currentView)
  const sortedTasks = sortTasks(filteredTasks, sortBy)
  const completedTasks = sortedTasks.filter(task => task.completed)
  const incompleteTasks = sortedTasks.filter(task => !task.completed)

  const taskCounts = {
    myDay: filterTasks(tasks, 'myDay').length,
    important: filterTasks(tasks, 'important').length,
    planned: filterTasks(tasks, 'planned').length,
    assigned: filterTasks(tasks, 'assigned').length,
    flagged: filterTasks(tasks, 'flagged').length,
    tasks: filterTasks(tasks, 'tasks').length,
  }

  const handleAddTask = (title: string) => {
    const newTask: Task = {
      id: Math.max(0, ...tasks.map(t => t.id)) + 1,
      title: title,
      completed: false,
      priority: 'medium',
      important: false,
      list: currentView === 'tasks' ? 'tasks' : 'custom'
    }
    setTasks([...tasks, newTask])
    toast({
      title: "Task added",
      description: `"${newTask.title}" has been added to your task list.`,
    })
  }

  const toggleTaskCompletion = (taskId: number) => {
    setTasks(tasks.map(task =>
      task.id === taskId
        ? { ...task, completed: !task.completed }
        : task
    ))
  }

  const deleteTask = (taskId: number) => {
    const taskToDelete = tasks.find(task => task.id === taskId)
    setTasks(tasks.filter(task => task.id !== taskId))
    toast({
      title: "Task deleted",
      description: `"${taskToDelete?.title}" has been removed from your task list.`,
      variant: "destructive",
    })
  }

  const editTask = (taskId: number, newTitle: string) => {
    setTasks(tasks.map(task =>
      task.id === taskId
        ? { ...task, title: newTitle }
        : task
    ))
  }

  const updateTaskDueDate = (taskId: number, newDate: Date | undefined) => {
    setTasks(tasks.map(task =>
      task.id === taskId
        ? { ...task, dueDate: newDate?.toISOString().split('T')[0] }
        : task
    ))
  }

  const updateTaskPriority = (taskId: number, newPriority: Task['priority']) => {
    setTasks(tasks.map(task =>
      task.id === taskId
        ? { ...task, priority: newPriority }
        : task
    ))
  }

  const toggleTaskImportant = (taskId: number) => {
    setTasks(tasks.map(task =>
      task.id === taskId
        ? { ...task, important: !task.important }
        : task
    ))
  }

  return (
    <div className="flex h-screen bg-[#202020] text-white">
      <Sidebar 
        currentView={currentView}
        setCurrentView={setCurrentView}
        taskCounts={taskCounts}
      />
      <div className="flex-1 overflow-auto p-6">
        <TaskList
          tasks={incompleteTasks}
          completedTasks={completedTasks}
          onToggleComplete={toggleTaskCompletion}
          onDelete={deleteTask}
          onEdit={editTask}
          onUpdateDueDate={updateTaskDueDate}
          onUpdatePriority={updateTaskPriority}
          onToggleImportant={toggleTaskImportant}
          onAddTask={handleAddTask}
          sortBy={sortBy}
          onSortChange={setSortBy}
          currentView={currentView}
        />
      </div>
      <Toaster />
    </div>
  )
}

