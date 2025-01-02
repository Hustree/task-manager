import { useState } from "react";
import { Task } from "../types";
import { Checkbox } from "@/app/components/ui/checkbox";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import {
  CalendarIcon,
  Pencil,
  Trash2,
  AlertTriangle,
  AlertCircle,
  Check,
  Star,
} from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/app/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";
import { cn } from "@/lib/utils";

interface TaskItemProps {
  task: Task;
  onToggleComplete: (id: number) => void;
  onDelete: (id: number) => void;
  onEdit: (id: number, newTitle: string) => void;
  onUpdateDueDate: (id: number, newDate: Date | undefined) => void;
  onUpdatePriority: (id: number, newPriority: Task["priority"]) => void;
  onToggleImportant: (id: number) => void;
}

export function TaskItem({
  task,
  onToggleComplete,
  onDelete,
  onEdit,
  onUpdateDueDate,
  onUpdatePriority,
  onToggleImportant,
}: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);

  const handleEdit = () => {
    onEdit(task.id, editedTitle);
    setIsEditing(false);
  };

  const priorityIcon = {
    low: <AlertCircle className="h-4 w-4 text-blue-500" />,
    medium: <AlertTriangle className="h-4 w-4 text-yellow-500" />,
    high: <AlertTriangle className="h-4 w-4 text-red-500" />,
  };

  return (
    <div className="flex items-center gap-3 p-3 hover:bg-gray-800 rounded-lg group">
      <Checkbox
        checked={task.completed}
        onCheckedChange={() => onToggleComplete(task.id)}
        className="w-5 h-5 border-gray-400 data-[state=checked]:border-blue-500 data-[state=checked]:bg-blue-500"
      />
      {isEditing ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleEdit();
          }}
          className="flex-1"
        >
          <Input
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            className="bg-gray-700"
            autoFocus
          />
        </form>
      ) : (
        <span
          className={cn(
            "flex-1 group-hover:text-white",
            task.completed && "line-through text-gray-400"
          )}
        >
          {task.title}
        </span>
      )}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onToggleImportant(task.id)}
        className={cn(task.important && "text-yellow-500")}
      >
        <Star className="h-4 w-4" />
      </Button>
      <Popover>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <PopoverTrigger asChild>
                <Button variant="outline" className="h-8 w-8 p-0">
                  {priorityIcon[task.priority]}
                </Button>
              </PopoverTrigger>
            </TooltipTrigger>
            <TooltipContent>Set priority</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <PopoverContent className="w-40">
          <div className="grid gap-2">
            <Button
              variant="outline"
              onClick={() => onUpdatePriority(task.id, "low")}
            >
              Low
            </Button>
            <Button
              variant="outline"
              onClick={() => onUpdatePriority(task.id, "medium")}
            >
              Medium
            </Button>
            <Button
              variant="outline"
              onClick={() => onUpdatePriority(task.id, "high")}
            >
              High
            </Button>
          </div>
        </PopoverContent>
      </Popover>
      <Popover>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <PopoverTrigger asChild>
                <Button variant="outline" className="h-8 w-8 p-0">
                  <CalendarIcon className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
            </TooltipTrigger>
            <TooltipContent>Set due date</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={task.dueDate ? new Date(task.dueDate) : undefined}
            onSelect={(date) => onUpdateDueDate(task.id, date)}
            initialFocus
          />
        </PopoverContent>
      </Popover>
      {task.dueDate && (
        <span className="text-sm text-gray-400">
          {format(new Date(task.dueDate), "MMM d, yyyy")}
        </span>
      )}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? (
                <Check className="h-4 w-4" />
              ) : (
                <Pencil className="h-4 w-4" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>{isEditing ? "Save" : "Edit task"}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(task.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Delete task</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
