import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import MainFeature from '../components/MainFeature'
import ApperIcon from '../components/ApperIcon'

function Home() {
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    const isDark = localStorage.getItem('darkMode') === 'true'
    setDarkMode(isDark)
    if (isDark) {
      document.documentElement.classList.add('dark')
    }
  }, [])

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode
    setDarkMode(newDarkMode)
    localStorage.setItem('darkMode', newDarkMode.toString())
    if (newDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary-200 rounded-full blur-xl"></div>
        <div className="absolute top-40 right-20 w-48 h-48 bg-secondary-200 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-accent/20 rounded-full blur-xl"></div>
      </div>

      {/* Header */}
      <motion.header 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 px-4 sm:px-6 lg:px-8 py-6"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <motion.div 
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center shadow-lg">
                <ApperIcon name="CheckSquare" className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full animate-pulse"></div>
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-surface-800 dark:text-surface-100">
                TaskFlow
              </h1>
              <p className="text-xs text-surface-600 dark:text-surface-400 hidden sm:block">
                Organize. Prioritize. Achieve.
              </p>
            </div>
          </motion.div>

          <motion.button
            onClick={toggleDarkMode}
            whileHover={{ scale: 1.1, rotate: 180 }}
            whileTap={{ scale: 0.9 }}
            className="relative p-3 rounded-xl bg-white/80 dark:bg-surface-800/80 backdrop-blur-sm border border-surface-200 dark:border-surface-600 shadow-soft hover:shadow-card transition-all duration-300"
          >
            <ApperIcon 
              name={darkMode ? "Sun" : "Moon"} 
              className="w-5 h-5 text-surface-700 dark:text-surface-300" 
            />
          </motion.button>
        </div>
      </motion.header>

      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.2 }}
        className="relative z-10 px-4 sm:px-6 lg:px-8 py-8 sm:py-12"
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mb-8"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-surface-800 dark:text-surface-100 mb-4 leading-tight">
              Transform Your
              <span className="block bg-gradient-to-r from-primary-500 via-secondary-500 to-accent bg-clip-text text-transparent">
                Productivity
              </span>
            </h2>
            <p className="text-lg sm:text-xl text-surface-600 dark:text-surface-400 max-w-2xl mx-auto leading-relaxed">
              Experience task management reimagined. Create, organize, and complete tasks with an intuitive interface designed for modern productivity.
            </p>
          </motion.div>

          {/* Feature Pills */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-wrap justify-center gap-3 mb-12"
          >
            {[
              { icon: "Zap", text: "Lightning Fast" },
              { icon: "Target", text: "Priority Focus" },
              { icon: "Calendar", text: "Smart Scheduling" },
              { icon: "BarChart3", text: "Progress Tracking" }
            ].map((feature, index) => (
              <motion.div
                key={feature.text}
                whileHover={{ scale: 1.05, y: -2 }}
                className="flex items-center space-x-2 px-4 py-2 bg-white/70 dark:bg-surface-800/70 backdrop-blur-sm rounded-full border border-surface-200 dark:border-surface-600 shadow-soft"
              >
                <ApperIcon name={feature.icon} className="w-4 h-4 text-primary-500" />
                <span className="text-sm font-medium text-surface-700 dark:text-surface-300">
                  {feature.text}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Main Feature */}
      <motion.section 
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.8 }}
        className="relative z-10 px-4 sm:px-6 lg:px-8 pb-12"
      >
        <MainFeature />
      </motion.section>

      {/* Floating Elements */}
      <div className="fixed top-1/4 left-4 opacity-20 dark:opacity-10 animate-float">
        <ApperIcon name="Circle" className="w-8 h-8 text-primary-300" />
      </div>
      <div className="fixed top-1/3 right-8 opacity-20 dark:opacity-10 animate-float" style={{ animationDelay: '1s' }}>
        <ApperIcon name="Square" className="w-6 h-6 text-secondary-300" />
      </div>
      <div className="fixed bottom-1/4 left-1/3 opacity-20 dark:opacity-10 animate-float" style={{ animationDelay: '2s' }}>
        <ApperIcon name="Triangle" className="w-7 h-7 text-accent/50" />
      </div>
    </div>
  )
}

export default Home