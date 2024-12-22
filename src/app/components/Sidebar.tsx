import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Sun, Star, Calendar, User, Flag, ListTodo, Plus, Search } from 'lucide-react'
import { View } from '../types'

interface SidebarProps {
  currentView: View;
  setCurrentView: (view: View) => void;
  taskCounts: Record<string, number>;
}

export function Sidebar({ currentView, setCurrentView, taskCounts }: SidebarProps) {
  return (
    <div className="w-72 border-r border-gray-800 flex flex-col">
      <div className="p-4">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-full bg-gray-700" />
          <div>
            <div className="font-semibold">Joshua Bascos</div>
            <div className="text-sm text-gray-400">joshuabascos@gmail.com</div>
          </div>
        </div>
        <div className="relative mb-6">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="search"
            placeholder="Search"
            className="w-full bg-gray-800 border-0 pl-10"
          />
        </div>
        <nav className="space-y-1">
          <Button 
            variant={currentView === 'myDay' ? 'secondary' : 'ghost'} 
            className="w-full justify-start gap-3"
            onClick={() => setCurrentView('myDay')}
          >
            <Sun className="w-4 h-4" /> My Day
            {taskCounts['myDay'] > 0 && <span className="ml-auto text-xs">{taskCounts['myDay']}</span>}
          </Button>
          <Button 
            variant={currentView === 'important' ? 'secondary' : 'ghost'} 
            className="w-full justify-start gap-3"
            onClick={() => setCurrentView('important')}
          >
            <Star className="w-4 h-4" /> Important
            {taskCounts['important'] > 0 && <span className="ml-auto text-xs">{taskCounts['important']}</span>}
          </Button>
          <Button 
            variant={currentView === 'planned' ? 'secondary' : 'ghost'} 
            className="w-full justify-start gap-3"
            onClick={() => setCurrentView('planned')}
          >
            <Calendar className="w-4 h-4" /> Planned
            {taskCounts['planned'] > 0 && <span className="ml-auto text-xs">{taskCounts['planned']}</span>}
          </Button>
          <Button 
            variant={currentView === 'assigned' ? 'secondary' : 'ghost'} 
            className="w-full justify-start gap-3"
            onClick={() => setCurrentView('assigned')}
          >
            <User className="w-4 h-4" /> Assigned to me
            {taskCounts['assigned'] > 0 && <span className="ml-auto text-xs">{taskCounts['assigned']}</span>}
          </Button>
          <Button 
            variant={currentView === 'tasks' ? 'secondary' : 'ghost'} 
            className="w-full justify-start gap-3"
            onClick={() => setCurrentView('tasks')}
          >
            <ListTodo className="w-4 h-4" /> Tasks
            {taskCounts['tasks'] > 0 && <span className="ml-auto text-xs">{taskCounts['tasks']}</span>}
          </Button>
        </nav>
      </div>
      <div className="mt-auto p-4 border-t border-gray-800">
        <Button variant="ghost" className="w-full justify-start gap-3">
          <Plus className="w-4 h-4" /> New list
        </Button>
      </div>
    </div>
  )
}

