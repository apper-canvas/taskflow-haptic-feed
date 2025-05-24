import { useState, useRef } from 'react'
import { DndProvider, useDrag, useDrop } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import { format } from 'date-fns'
import ApperIcon from './ApperIcon'
import TimeTracker from './TimeTracker'

const ItemTypes = {
  TASK: 'task'
}

const COLUMNS = [
  { id: 'todo', title: 'To Do', color: 'slate', icon: 'CircleDot' },
  { id: 'inprogress', title: 'In Progress', color: 'blue', icon: 'Clock' },
  { id: 'testing', title: 'Testing', color: 'yellow', icon: 'TestTube' },
  { id: 'done', title: 'Done', color: 'green', icon: 'CheckCircle' }
]

const getIconColor = (color) => {
  const styles = {
    slate: 'text-slate-500',
    blue: 'text-blue-500',
    yellow: 'text-yellow-500',
    green: 'text-green-500'
  }
  return styles[color] || styles.slate
}

function TaskCard({ task, onEdit, onDelete, onStatusChange }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    title: task.title,
    description: task.description || '',
    priority: task.priority,
    dueDate: task.dueDate || '',
    assignedTo: task.assignedTo || ''
  })

  const ref = useRef(null)

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.TASK,
    item: { id: task.id, status: task.status },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  })

  drag(ref)

  const getPriorityConfig = (priority) => {
    switch (priority) {
      case 'high':
        return { 
          color: 'bg-red-500', 
          textColor: 'text-red-500',
          bgColor: 'bg-red-50 dark:bg-red-900/20',
          size: 'scale-105',
          glow: 'shadow-lg shadow-red-200'
        }
      case 'medium':
        return { 
          color: 'bg-amber-500', 
          textColor: 'text-amber-500',
          bgColor: 'bg-amber-50 dark:bg-amber-900/20',
          size: 'scale-100',
          glow: 'shadow-md shadow-amber-200'
        }
      case 'low':
        return { 
          color: 'bg-green-500', 
          textColor: 'text-green-500',
          bgColor: 'bg-green-50 dark:bg-green-900/20',
          size: 'scale-95',
          glow: 'shadow-sm shadow-green-200'
        }
      default:
        return { 
          color: 'bg-surface-400', 
          textColor: 'text-surface-400',
          bgColor: 'bg-surface-50 dark:bg-surface-900/20',
          size: 'scale-100',
          glow: 'shadow-sm'
        }
    }
  }

  const priorityConfig = getPriorityConfig(task.priority)

  const handleSaveEdit = () => {
    if (!editForm.title.trim()) {
      toast.error('Task title is required')
      return
    }

    onEdit(task.id, editForm)
    setIsEditing(false)
    toast.success('Task updated successfully')
  }

  const handleCancelEdit = () => {
    setEditForm({
      title: task.title,
      description: task.description || '',
      priority: task.priority,
      dueDate: task.dueDate || '',
      assignedTo: task.assignedTo || ''
    })
    setIsEditing(false)
  }

  return (
    <motion.div
      ref={ref}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isDragging ? 0.5 : 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className={`group bg-white dark:bg-surface-700 rounded-xl border border-surface-200 dark:border-surface-600 p-4 cursor-move hover:shadow-lg transition-all duration-200 ${priorityConfig.size} ${priorityConfig.glow} ${isDragging ? 'task-card-dragging' : ''}`}
    >
      {isEditing ? (
        <div className="space-y-3">
          <input
            type="text"
            value={editForm.title}
            onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
            className="w-full px-3 py-2 text-sm bg-surface-50 dark:bg-surface-600 border border-surface-200 dark:border-surface-500 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Task title"
          />
          
          <textarea
            value={editForm.description}
            onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
            className="w-full px-3 py-2 text-sm bg-surface-50 dark:bg-surface-600 border border-surface-200 dark:border-surface-500 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
            rows={2}
            placeholder="Description"
          />
          
          <div className="grid grid-cols-2 gap-2">
            <select
              value={editForm.priority}
              onChange={(e) => setEditForm(prev => ({ ...prev, priority: e.target.value }))}
              className="px-3 py-2 text-sm bg-surface-50 dark:bg-surface-600 border border-surface-200 dark:border-surface-500 rounded-lg"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            
            <input
              type="date"
              value={editForm.dueDate}
              onChange={(e) => setEditForm(prev => ({ ...prev, dueDate: e.target.value }))}
              className="px-3 py-2 text-sm bg-surface-50 dark:bg-surface-600 border border-surface-200 dark:border-surface-500 rounded-lg"
            />
          </div>
          
          <input
            type="text"
            value={editForm.assignedTo}
            onChange={(e) => setEditForm(prev => ({ ...prev, assignedTo: e.target.value }))}
            className="w-full px-3 py-2 text-sm bg-surface-50 dark:bg-surface-600 border border-surface-200 dark:border-surface-500 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Assigned to (email or name)"
          />
          
          <div className="flex gap-2">
            <button
              onClick={handleSaveEdit}
              className="flex-1 px-3 py-2 text-sm bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
            >
              Save
            </button>
            <button
              onClick={handleCancelEdit}
              className="flex-1 px-3 py-2 text-sm bg-surface-200 dark:bg-surface-600 text-surface-700 dark:text-surface-300 rounded-lg hover:bg-surface-300 dark:hover:bg-surface-500 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Priority indicator */}
          <div className={`w-full h-1 ${priorityConfig.color} rounded-full mb-3`} />
          
          {/* Task content */}
          <div className="mb-3">
            <h4 className="font-semibold text-surface-800 dark:text-surface-100 mb-1 line-clamp-2">
              {task.title}
            </h4>
            {task.description && (
              <p className="text-sm text-surface-600 dark:text-surface-400 line-clamp-2">
                {task.description}
              </p>
            )}
          </div>
          
          {/* Priority badge */}
          <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium mb-3 ${priorityConfig.bgColor} ${priorityConfig.textColor}`}>
            <ApperIcon name="Flag" className="w-3 h-3" />
            <span className="capitalize">{task.priority}</span>
          </div>
          
          {/* Task metadata */}
          <div className="space-y-2 text-xs text-surface-500 dark:text-surface-400">
            {task.dueDate && (
              <div className="flex items-center gap-1">
                <ApperIcon name="Calendar" className="w-3 h-3" />
                <span>{format(new Date(task.dueDate), 'MMM dd')}</span>
              </div>
            )}
            
            {task.assignedTo && (
              <div className="flex items-center gap-1">
                <ApperIcon name="User" className="w-3 h-3" />
                <span className="truncate">{task.assignedTo}</span>
              </div>
            )}
            
            {task.project && (
              <div className="flex items-center gap-1">
                <ApperIcon name="Folder" className="w-3 h-3" />
                <span className="capitalize">{task.project}</span>
              </div>
            )}
          </div>
          
          {/* Action buttons */}
          <div className="flex gap-1 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => setIsEditing(true)}
              className="flex-1 px-2 py-1 text-xs bg-surface-100 dark:bg-surface-600 text-surface-600 dark:text-surface-300 rounded hover:bg-surface-200 dark:hover:bg-surface-500 transition-colors"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(task.id)}
              className="px-2 py-1 text-xs bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
            >
              <ApperIcon name="Trash2" className="w-3 h-3" />
            </button>
          </div>
          
          {/* Time Tracker */}
          <div className="mt-3 pt-3 border-t border-surface-200 dark:border-surface-600">
            <TimeTracker
              task={task}
              onTaskUpdate={onEdit}
            />
          </div>
        </>
      )}
    </motion.div>
  )
}

function KanbanColumn({ column, tasks, onTaskDrop, onTaskEdit, onTaskDelete }) {
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: ItemTypes.TASK,
    drop: (item) => {
      if (item.status !== column.id) {
        onTaskDrop(item.id, column.id)
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop()
    })
  })

  const getColumnStyle = (color) => {
    const styles = {
      slate: 'border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/50',
      blue: 'border-blue-200 dark:border-blue-600 bg-blue-50 dark:bg-blue-800/50',
      yellow: 'border-yellow-200 dark:border-yellow-600 bg-yellow-50 dark:bg-yellow-800/50',
      green: 'border-green-200 dark:border-green-600 bg-green-50 dark:bg-green-800/50'
    }
    return styles[color] || styles.slate
  }

  return (
    <div
      ref={drop}
      className={`kanban-column flex-1 min-w-0 p-4 rounded-xl border-2 border-dashed transition-all duration-200 ${getColumnStyle(column.color)} ${
        isOver && canDrop ? 'drag-over' : ''
      }`}
    >
      {/* Column header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <ApperIcon name={column.icon} className={`w-5 h-5 ${getIconColor(column.color)}`} />
          <h3 className="font-semibold text-surface-800 dark:text-surface-100">
            {column.title}
          </h3>
          <span className={`px-2 py-1 text-xs font-medium rounded-full bg-surface-200 dark:bg-surface-600 text-surface-600 dark:text-surface-300`}>
            {tasks.length}
          </span>
        </div>
      </div>
      
      {/* Tasks */}
      <div className="space-y-3">
        <AnimatePresence>
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={onTaskEdit}
              onDelete={onTaskDelete}
            />
          ))}
        </AnimatePresence>
        
        {/* Drop indicator */}
        <div className={`drop-indicator ${isOver && canDrop ? 'active' : ''}`} />
        
        {tasks.length === 0 && (
          <div className="text-center py-8 text-surface-400 dark:text-surface-500">
            <ApperIcon name="Plus" className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Drop tasks here</p>
          </div>
        )}
      </div>
    </div>
  )
}

function KanbanBoard({ tasks, onTaskUpdate, onTaskDelete }) {
  const handleTaskDrop = (taskId, newStatus) => {
    const task = tasks.find(t => t.id === taskId)
    if (task) {
      const statusMap = {
        'todo': 'pending',
        'inprogress': 'in-progress',
        'testing': 'testing',
        'done': 'completed'
      }
      
      onTaskUpdate(taskId, { 
        ...task, 
        status: newStatus,
        kanbanStatus: newStatus,
        completed: newStatus === 'done'
      })
      
      const statusLabels = {
        'todo': 'To Do',
        'inprogress': 'In Progress',
        'testing': 'Testing',
        'done': 'Done'
      }
      
      toast.success(`Task moved to ${statusLabels[newStatus]}`)
    }
  }

  const handleTaskEdit = (taskId, updatedData) => {
    const task = tasks.find(t => t.id === taskId)
    if (task) {
      onTaskUpdate(taskId, { ...task, ...updatedData })
    }
  }

  const handleTaskDelete = (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      onTaskDelete(taskId)
      toast.success('Task deleted successfully')
    }
  }

  const getTasksByStatus = (status) => {
    return tasks.filter(task => {
      // Map existing task states to Kanban columns
      const taskStatus = task.kanbanStatus || (task.completed ? 'done' : 'todo')
      return taskStatus === status
    })
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="bg-white/90 dark:bg-surface-800/90 backdrop-blur-xl rounded-3xl border border-surface-200 dark:border-surface-600 shadow-soft p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
              <ApperIcon name="KanbanSquare" className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-surface-800 dark:text-surface-100">
                Kanban Board
              </h2>
              <p className="text-surface-600 dark:text-surface-400 text-sm">
                Drag and drop tasks to update their status
              </p>
            </div>
          </div>
        </div>
        
        {/* Kanban columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 min-h-[600px]">
          {COLUMNS.map((column) => (
            <KanbanColumn
              key={column.id}
              column={column}
              tasks={getTasksByStatus(column.id)}
              onTaskDrop={handleTaskDrop}
              onTaskEdit={handleTaskEdit}
              onTaskDelete={handleTaskDelete}
            />
          ))}
        </div>
        
        {/* Statistics */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          {COLUMNS.map((column) => {
            const columnTasks = getTasksByStatus(column.id)
            const highPriorityCount = columnTasks.filter(t => t.priority === 'high').length
            
            return (
              <div key={column.id} className="text-center p-3 bg-surface-50 dark:bg-surface-700 rounded-lg">
                <div className={`text-2xl font-bold ${getIconColor(column.color)}`}>
                  {columnTasks.length}
                </div>
                <div className="text-sm text-surface-600 dark:text-surface-400">
                  {column.title}
                </div>
                {highPriorityCount > 0 && (
                  <div className="text-xs text-red-500 mt-1">
                    {highPriorityCount} high priority
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </DndProvider>
  )
}

export default KanbanBoard