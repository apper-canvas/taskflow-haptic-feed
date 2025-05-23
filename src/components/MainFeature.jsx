import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import { format } from 'date-fns'
import ApperIcon from './ApperIcon'
import KanbanBoard from './KanbanBoard'
import TimeTracker from './TimeTracker'
import ProjectSidebar from './ProjectSidebar'

function MainFeature() {
  const [tasks, setTasks] = useState([])
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [filter, setFilter] = useState('all')
  const [viewMode, setViewMode] = useState('list') // 'list' or 'kanban'
  
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
    project: 'personal'
  })

  // Load tasks from localStorage on component mount
  useEffect(() => {
    const savedTasks = localStorage.getItem('taskflow-tasks')
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks))
    }
  }, [])
  
  // Load view mode from localStorage
  useEffect(() => {
    const savedViewMode = localStorage.getItem('taskflow-view-mode')
    if (savedViewMode) setViewMode(savedViewMode)
  }, [])

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem('taskflow-tasks', JSON.stringify(tasks))
  }, [tasks])

  // Save view mode to localStorage
  useEffect(() => {
    localStorage.setItem('taskflow-view-mode', viewMode)
  }, [viewMode])

  const handleCreateTask = (e) => {
    e.preventDefault()
    
    if (!newTask.title.trim()) {
      toast.error('Please enter a task title')
      return
    }

    const task = {
      id: Date.now().toString(),
      ...newTask,
      status: 'pending',
      kanbanStatus: 'todo',
      createdAt: new Date().toISOString(),
      assignedTo: '',
      completed: false,
      timeTracking: {
        totalTime: 0,
        isRunning: false,
        startTime: null
      }
    }

    setTasks(prev => [task, ...prev])
    setNewTask({
      title: '',
      description: '',
      priority: 'medium',
      dueDate: '',
      project: 'personal',
      assignedTo: ''
    })
    setShowCreateForm(false)
    toast.success('Task created successfully!')
  }

  const toggleTaskComplete = (taskId) => {
    setTasks(prev => prev.map(task => {
      if (task.id === taskId) {
        const updatedTask = { ...task, completed: !task.completed }
        toast.success(updatedTask.completed ? 'Task completed!' : 'Task reopened')
        return updatedTask
      }
      return task
    }))
  }

  const deleteTask = (taskId) => {
    setTasks(prev => prev.filter(task => task.id !== taskId))
    toast.success('Task deleted successfully')
  }

  const updateTask = (taskId, updatedTask) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? updatedTask : task
    ))
  }

  const handleViewModeChange = (mode) => {
    setViewMode(mode)
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-500'
      case 'medium': return 'bg-amber-500'
      case 'low': return 'bg-green-500'
      default: return 'bg-surface-400'
    }
  }

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high': return 'AlertCircle'
      case 'medium': return 'Clock'
      case 'low': return 'CheckCircle2'
      default: return 'Circle'
    }
  }

  const getProjectIcon = (project) => {
    switch (project) {
      case 'work': return 'Briefcase'
      case 'personal': return 'User'
      case 'health': return 'Heart'
      case 'learning': return 'BookOpen'
      default: return 'Folder'
    }
  }

  const filteredTasks = tasks.filter(task => {
    switch (filter) {
      case 'completed': return task.completed
      case 'pending': return !task.completed
      case 'high': return task.priority === 'high'
      case 'today': {
        const today = new Date().toDateString()
        return task.dueDate && new Date(task.dueDate).toDateString() === today
      }
      default: return true
    }
  })

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.completed).length,
    pending: tasks.filter(t => !t.completed).length,
    overdue: tasks.filter(t => !t.completed && t.dueDate && new Date(t.dueDate) < new Date()).length
  }

  // If Kanban view is selected, render the Kanban board
  if (viewMode === 'kanban') {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex justify-end">
          <button
            onClick={() => handleViewModeChange('list')}
            className="flex items-center gap-2 px-4 py-2 bg-surface-200 dark:bg-surface-600 text-surface-700 dark:text-surface-300 rounded-lg hover:bg-surface-300 dark:hover:bg-surface-500 transition-colors"
          >
            <ApperIcon name="List" className="w-4 h-4" />
            Switch to List View
          </button>
        </div>
        <KanbanBoard tasks={tasks} onTaskUpdate={updateTask} onTaskDelete={deleteTask} />
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Stats Dashboard */}
      <div className="flex gap-6">
        <div className="flex-1">
          <ProjectSidebar tasks={tasks} />
        </div>
        <div className="flex-[3]">
          <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
      >
        {[
          { label: 'Total Tasks', value: stats.total, icon: 'List', color: 'primary' },
          { label: 'Completed', value: stats.completed, icon: 'CheckCircle', color: 'green' },
          { label: 'Pending', value: stats.pending, icon: 'Clock', color: 'amber' },
          { label: 'Overdue', value: stats.overdue, icon: 'AlertTriangle', color: 'red' }
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white/80 dark:bg-surface-800/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-surface-200 dark:border-surface-600 shadow-soft hover:shadow-card transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-2">
              <div className={`w-10 h-10 rounded-xl bg-${stat.color}-100 dark:bg-${stat.color}-900/30 flex items-center justify-center`}>
                <ApperIcon name={stat.icon} className={`w-5 h-5 text-${stat.color}-600 dark:text-${stat.color}-400`} />
              </div>
              <span className="text-2xl sm:text-3xl font-bold text-surface-800 dark:text-surface-100">
                {stat.value}
              </span>
            </div>
            <p className="text-sm text-surface-600 dark:text-surface-400 font-medium">
              {stat.label}
            </p>
          </motion.div>
        ))}
      </motion.div>


      {/* Main Task Management Interface */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white/90 dark:bg-surface-800/90 backdrop-blur-xl rounded-3xl border border-surface-200 dark:border-surface-600 shadow-soft overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 sm:p-8 border-b border-surface-200 dark:border-surface-600">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-2xl sm:text-3xl font-bold text-surface-800 dark:text-surface-100">
                  Task Dashboard
                </h3>
                <button
                  onClick={() => handleViewModeChange('kanban')}
                  className="flex items-center gap-1 px-3 py-1 text-sm bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-lg hover:bg-primary-200 dark:hover:bg-primary-900/50 transition-colors"
                >
                  <ApperIcon name="KanbanSquare" className="w-4 h-4" />
                  Kanban
                </button>
              </div>
              <p className="text-surface-600 dark:text-surface-400">
                Manage your tasks with style and efficiency
              </p>
            </div>
            
            <motion.button
              onClick={() => setShowCreateForm(!showCreateForm)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold rounded-xl shadow-soft hover:shadow-card transition-all duration-300"
            >
              <ApperIcon name="Plus" className="w-5 h-5" />
              <span className="hidden sm:inline">Create Task</span>
              <span className="sm:hidden">Add</span>
            </motion.button>
          </div>

          {/* Filters */}
          <div className="mt-6 flex flex-wrap gap-2">
            {[
              { key: 'all', label: 'All Tasks', icon: 'List' },
              { key: 'pending', label: 'Pending', icon: 'Clock' },
              { key: 'completed', label: 'Completed', icon: 'CheckCircle' },
              { key: 'high', label: 'High Priority', icon: 'AlertCircle' },
              { key: 'today', label: 'Due Today', icon: 'Calendar' }
            ].map((filterOption) => (
              <motion.button
                key={filterOption.key}
                onClick={() => setFilter(filterOption.key)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg font-medium transition-all duration-200 ${
                  filter === filterOption.key
                    ? 'bg-primary-500 text-white shadow-soft'
                    : 'bg-surface-100 dark:bg-surface-700 text-surface-700 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-600'
                }`}
              >
                <ApperIcon name={filterOption.icon} className="w-4 h-4" />
                <span className="text-sm hidden sm:inline">{filterOption.label}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Create Task Form */}
        <AnimatePresence>
          {showCreateForm && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="border-b border-surface-200 dark:border-surface-600 overflow-hidden"
            >
              <form onSubmit={handleCreateTask} className="p-6 sm:p-8 space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-surface-700 dark:text-surface-300 mb-2">
                        Task Title *
                      </label>
                      <input
                        type="text"
                        value={newTask.title}
                        onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Enter task title..."
                        className="w-full px-4 py-3 bg-surface-50 dark:bg-surface-700 border border-surface-200 dark:border-surface-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-surface-700 dark:text-surface-300 mb-2">
                        Description
                      </label>
                      <textarea
                        value={newTask.description}
                        onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Add task description..."
                        rows={3}
                        className="w-full px-4 py-3 bg-surface-50 dark:bg-surface-700 border border-surface-200 dark:border-surface-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 resize-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-surface-700 dark:text-surface-300 mb-2">
                        Priority Level
                      </label>
                      <select
                        value={newTask.priority}
                        onChange={(e) => setNewTask(prev => ({ ...prev, priority: e.target.value }))}
                        className="w-full px-4 py-3 bg-surface-50 dark:bg-surface-700 border border-surface-200 dark:border-surface-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                      >
                        <option value="low">Low Priority</option>
                        <option value="medium">Medium Priority</option>
                        <option value="high">High Priority</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-surface-700 dark:text-surface-300 mb-2">
                        Due Date
                      </label>
                      <input
                        type="date"
                        value={newTask.dueDate}
                        onChange={(e) => setNewTask(prev => ({ ...prev, dueDate: e.target.value }))}
                        className="w-full px-4 py-3 bg-surface-50 dark:bg-surface-700 border border-surface-200 dark:border-surface-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-surface-700 dark:text-surface-300 mb-2">
                        Project Category
                      </label>
                      <select
                        value={newTask.project}
                        onChange={(e) => setNewTask(prev => ({ ...prev, project: e.target.value }))}
                        className="w-full px-4 py-3 bg-surface-50 dark:bg-surface-700 border border-surface-200 dark:border-surface-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                      >
                        <option value="personal">Personal</option>
                        <option value="work">Work</option>
                        <option value="health">Health</option>
                        <option value="learning">Learning</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-surface-700 dark:text-surface-300 mb-2">
                        Assigned To
                      </label>
                      <input
                        type="text"
                        value={newTask.assignedTo || ''}
                        onChange={(e) => setNewTask(prev => ({ ...prev, assignedTo: e.target.value }))}
                        placeholder="Enter email or name..."
                        className="w-full px-4 py-3 bg-surface-50 dark:bg-surface-700 border border-surface-200 dark:border-surface-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 sm:flex-none px-8 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold rounded-xl shadow-soft hover:shadow-card transition-all duration-300"
                  >
                    Create Task
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 sm:flex-none px-8 py-3 bg-surface-200 dark:bg-surface-600 text-surface-700 dark:text-surface-300 font-semibold rounded-xl hover:bg-surface-300 dark:hover:bg-surface-500 transition-all duration-300"
                  >
                    Cancel
                  </motion.button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Task List */}
        <div className="p-6 sm:p-8">
          {filteredTasks.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="w-20 h-20 bg-surface-100 dark:bg-surface-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <ApperIcon name="ListTodo" className="w-10 h-10 text-surface-400" />
              </div>
              <h4 className="text-xl font-semibold text-surface-600 dark:text-surface-400 mb-2">
                No tasks found
              </h4>
              <p className="text-surface-500 dark:text-surface-500">
                {filter === 'all' ? 'Create your first task to get started!' : `No tasks match the "${filter}" filter.`}
              </p>
            </motion.div>
          ) : (
            <div className="space-y-3">
              <AnimatePresence>
                {filteredTasks.map((task, index) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ delay: index * 0.05 }}
                    className={`group p-4 sm:p-6 rounded-2xl border transition-all duration-300 hover:shadow-card ${
                      task.completed 
                        ? 'bg-surface-50 dark:bg-surface-700/50 border-surface-200 dark:border-surface-600 opacity-75' 
                        : 'bg-white dark:bg-surface-700 border-surface-200 dark:border-surface-600 hover:border-primary-300 dark:hover:border-primary-600'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      {/* Completion Checkbox */}
                      <motion.button
                        onClick={() => toggleTaskComplete(task.id)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className={`flex-shrink-0 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-200 ${
                          task.completed
                            ? 'bg-green-500 border-green-500'
                            : 'border-surface-300 dark:border-surface-500 hover:border-primary-500'
                        }`}
                      >
                        {task.completed && (
                          <ApperIcon name="Check" className="w-4 h-4 text-white" />
                        )}
                      </motion.button>

                      {/* Task Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4 mb-3">
                          <div className="flex-1">
                            <h4 className={`font-semibold text-lg leading-tight ${
                              task.completed 
                                ? 'text-surface-500 dark:text-surface-400 line-through' 
                                : 'text-surface-800 dark:text-surface-100'
                            }`}>
                              {task.title}
                            </h4>
                            {task.description && (
                              <p className={`mt-1 text-sm leading-relaxed ${
                                task.completed 
                                  ? 'text-surface-400 dark:text-surface-500' 
                                  : 'text-surface-600 dark:text-surface-400'
                              }`}>
                                {task.description}
                              </p>
                            )}
                          </div>

                          {/* Priority Badge */}
                          <div className="flex items-center space-x-2 flex-shrink-0">
                            <div className={`flex items-center space-x-1 px-3 py-1 rounded-lg ${getPriorityColor(task.priority)}/10`}>
                              <ApperIcon 
                                name={getPriorityIcon(task.priority)} 
                                className={`w-3 h-3 ${getPriorityColor(task.priority).replace('bg-', 'text-')}`} 
                              />
                              <span className={`text-xs font-medium capitalize ${getPriorityColor(task.priority).replace('bg-', 'text-')}`}>
                                {task.priority}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Task Meta */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                          <div className="flex items-center space-x-4 text-sm text-surface-500 dark:text-surface-400">
                            <div className="flex items-center space-x-1">
                              <ApperIcon name={getProjectIcon(task.project)} className="w-4 h-4" />
                              <span className="capitalize">{task.project}</span>
                            </div>
                            
                            {task.dueDate && (
                              <div className="flex items-center space-x-1">
                                <ApperIcon name="Calendar" className="w-4 h-4" />
                                <span>
                                  {format(new Date(task.dueDate), 'MMM dd, yyyy')}
                                </span>
                              </div>
                            )}
                            
                            {task.assignedTo && (
                              <div className="flex items-center space-x-1">
                                <ApperIcon name="User" className="w-4 h-4" />
                                <span>{task.assignedTo}</span>
                              </div>
                            )}
                          </div>

                          {/* Actions */}
                          <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <motion.button
                              onClick={() => deleteTask(task.id)}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200"
                            >
                              <ApperIcon name="Trash2" className="w-4 h-4" />
                            </motion.button>
                          </div>
                        </div>
                      </div>

                    {/* Time Tracker */}
                    <div className="mt-3 pt-3 border-t border-surface-200 dark:border-surface-600">
                      <TimeTracker
                        task={task}
                        onTaskUpdate={updateTask}
                      />
                    </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </motion.div>
        </div>
      </div>
    </div>
  )
}

export default MainFeature