import { useMemo } from 'react'
import ApperIcon from './ApperIcon'
import ms from 'ms'

function ProjectSidebar({ tasks }) {
  const projectStats = useMemo(() => {
    const projects = ['personal', 'work', 'health', 'learning']
    
    return projects.map(project => {
      const projectTasks = tasks.filter(task => task.project === project)
      const totalTime = projectTasks.reduce((acc, task) => {
        return acc + (task.timeTracking?.totalTime || 0)
      }, 0)
      
      return {
        name: project,
        taskCount: projectTasks.length,
        totalTime,
        completedTasks: projectTasks.filter(task => task.completed).length
      }
    })
  }, [tasks])

  const getProjectIcon = (project) => {
    switch (project) {
      case 'work': return 'Briefcase'
      case 'personal': return 'User'
      case 'health': return 'Heart'
      case 'learning': return 'BookOpen'
      default: return 'Folder'
    }
  }

  const getProjectColor = (project) => {
    switch (project) {
      case 'work': return 'blue'
      case 'personal': return 'green'
      case 'health': return 'red'
      case 'learning': return 'purple'
      default: return 'gray'
    }
  }

  return (
    <div className="bg-white/90 dark:bg-surface-800/90 backdrop-blur-xl rounded-3xl border border-surface-200 dark:border-surface-600 shadow-soft p-6">
      <h3 className="text-lg font-bold text-surface-800 dark:text-surface-100 mb-4 flex items-center gap-2">
        <ApperIcon name="FolderOpen" className="w-5 h-5" />
        Project Overview
      </h3>
      
      <div className="space-y-3">
        {projectStats.map(project => (
          <div key={project.name} className="p-3 rounded-lg bg-surface-50 dark:bg-surface-700 border border-surface-200 dark:border-surface-600">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-lg bg-${getProjectColor(project.name)}-100 dark:bg-${getProjectColor(project.name)}-900/30 flex items-center justify-center`}>
                  <ApperIcon name={getProjectIcon(project.name)} className={`w-4 h-4 text-${getProjectColor(project.name)}-600 dark:text-${getProjectColor(project.name)}-400`} />
                </div>
                <span className="font-medium text-surface-700 dark:text-surface-300 capitalize">{project.name}</span>
              </div>
            </div>
            <div className="text-xs text-surface-600 dark:text-surface-400 space-y-1">
              <div>Tasks: {project.completedTasks}/{project.taskCount}</div>
              <div>Time: {ms(project.totalTime, { long: true }) || '0s'}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ProjectSidebar