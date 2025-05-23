import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import ApperIcon from './ApperIcon'
import ms from 'ms'

function TimeTracker({ task, onTaskUpdate }) {
  const [currentTime, setCurrentTime] = useState(0)

  useEffect(() => {
    let interval = null
    
    if (task.timeTracking.isRunning) {
      interval = setInterval(() => {
        const now = Date.now()
        const elapsed = now - task.timeTracking.startTime
        setCurrentTime(task.timeTracking.totalTime + elapsed)
      }, 1000)
    } else {
      setCurrentTime(task.timeTracking.totalTime)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [task.timeTracking.isRunning, task.timeTracking.startTime, task.timeTracking.totalTime])

  const startTimer = () => {
    const updatedTask = {
      ...task,
      timeTracking: {
        ...task.timeTracking,
        isRunning: true,
        startTime: Date.now()
      }
    }
    onTaskUpdate(task.id, updatedTask)
    toast.success('Timer started!')
  }

  const stopTimer = () => {
    if (task.timeTracking.isRunning) {
      const now = Date.now()
      const sessionTime = now - task.timeTracking.startTime
      const updatedTask = {
        ...task,
        timeTracking: {
          totalTime: task.timeTracking.totalTime + sessionTime,
          isRunning: false,
          startTime: null
        }
      }
      onTaskUpdate(task.id, updatedTask)
      toast.success(`Timer stopped! Session: ${ms(sessionTime, { long: true })}`)
    }
  }

  const resetTimer = () => {
    const updatedTask = {
      ...task,
      timeTracking: {
        totalTime: 0,
        isRunning: false,
        startTime: null
      }
    }
    onTaskUpdate(task.id, updatedTask)
    toast.info('Timer reset!')
  }

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className={`px-3 py-1 rounded-lg text-sm font-medium ${task.timeTracking.isRunning ? 'bg-green-100 text-green-700 timer-active' : 'bg-surface-100 text-surface-600'}`}>
          {ms(currentTime, { long: true }) || '0s'}
        </div>
      </div>
      <div className="flex items-center space-x-1">
        <button onClick={task.timeTracking.isRunning ? stopTimer : startTimer} className={`p-1.5 rounded-lg transition-colors ${task.timeTracking.isRunning ? 'text-red-500 hover:bg-red-50' : 'text-green-500 hover:bg-green-50'}`}>
          <ApperIcon name={task.timeTracking.isRunning ? "Pause" : "Play"} className="w-4 h-4" />
        </button>
        <button onClick={resetTimer} className="p-1.5 text-surface-500 hover:bg-surface-100 rounded-lg transition-colors">
          <ApperIcon name="RotateCcw" className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

export default TimeTracker