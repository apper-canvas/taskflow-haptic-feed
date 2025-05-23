import { useState, useEffect } from 'react'
import Select from 'react-select'
import { toast } from 'react-toastify'
import ApperIcon from './ApperIcon'

function TeamMemberSelector({ 
  selectedMembers = [], 
  onMembersChange, 
  isMultiple = false,
  placeholder = "Select team member...",
  className = ""
}) {
  const [teamMembers, setTeamMembers] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  // Default team members
  const defaultMembers = [
    { id: '1', name: 'John Doe', email: 'john.doe@company.com', avatar: 'JD', role: 'Developer' },
    { id: '2', name: 'Sarah Wilson', email: 'sarah.wilson@company.com', avatar: 'SW', role: 'Designer' },
    { id: '3', name: 'Mike Johnson', email: 'mike.johnson@company.com', avatar: 'MJ', role: 'Project Manager' },
    { id: '4', name: 'Emily Chen', email: 'emily.chen@company.com', avatar: 'EC', role: 'QA Engineer' },
    { id: '5', name: 'David Brown', email: 'david.brown@company.com', avatar: 'DB', role: 'Developer' },
    { id: '6', name: 'Lisa Rodriguez', email: 'lisa.rodriguez@company.com', avatar: 'LR', role: 'UX Designer' }
  ]

  // Load team members from localStorage or use defaults
  useEffect(() => {
    const savedMembers = localStorage.getItem('taskflow-team-members')
    if (savedMembers) {
      setTeamMembers(JSON.parse(savedMembers))
    } else {
      setTeamMembers(defaultMembers)
      localStorage.setItem('taskflow-team-members', JSON.stringify(defaultMembers))
    }
  }, [])

  // Save team members to localStorage whenever they change
  useEffect(() => {
    if (teamMembers.length > 0) {
      localStorage.setItem('taskflow-team-members', JSON.stringify(teamMembers))
    }
  }, [teamMembers])

  const addNewMember = (inputValue) => {
    if (!inputValue || inputValue.length < 2) {
      toast.error('Please enter a valid name (at least 2 characters)')
      return null
    }

    // Check if member already exists
    const existingMember = teamMembers.find(
      member => member.name.toLowerCase() === inputValue.toLowerCase() || 
                member.email.toLowerCase() === inputValue.toLowerCase()
    )

    if (existingMember) {
      toast.warning('Team member already exists')
      return existingMember
    }

    // Generate avatar initials
    const generateAvatar = (name) => {
      return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2)
    }

    // Create new member
    const newMember = {
      id: Date.now().toString(),
      name: inputValue,
      email: inputValue.includes('@') ? inputValue : `${inputValue.toLowerCase().replace(/\s+/g, '.')}@company.com`,
      avatar: generateAvatar(inputValue),
      role: 'Team Member'
    }

    setTeamMembers(prev => [...prev, newMember])
    toast.success(`Added ${newMember.name} to team`)
    return newMember
  }

  const formatOptionLabel = (member) => (
    <div className="flex items-center space-x-3 py-1">
      <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
        {member.avatar}
      </div>
      <div className="flex-1">
        <div className="font-medium text-surface-800 dark:text-surface-100">{member.name}</div>
        <div className="text-xs text-surface-500">{member.email}</div>
      </div>
      <div className="text-xs text-surface-400 bg-surface-100 px-2 py-1 rounded-md">
        {member.role}
      </div>
    </div>
  )

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: 'rgb(248 250 252)',
      border: state.isFocused ? '2px solid rgb(99 102 241)' : '1px solid rgb(226 232 240)',
      borderRadius: '12px',
      padding: '8px',
      boxShadow: 'none',
      '&:hover': {
        borderColor: 'rgb(99 102 241)'
      }
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: 'white',
      border: '1px solid rgb(226 232 240)',
      borderRadius: '12px',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
      zIndex: 9999
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? 'rgb(99 102 241)' : state.isFocused ? 'rgb(248 250 252)' : 'white',
      '&:hover': {
        backgroundColor: 'rgb(248 250 252)'
      }
    })
  }

  return (
    <div className={className}>
      <Select
        isMulti={isMultiple}
        value={selectedMembers}
        onChange={onMembersChange}
        options={teamMembers}
        getOptionLabel={(member) => member.name}
        getOptionValue={(member) => member.id}
        formatOptionLabel={formatOptionLabel}
        placeholder={placeholder}
        isSearchable
        isClearable
        isLoading={isLoading}
        onCreateOption={addNewMember}
        styles={customStyles}
        noOptionsMessage={() => "No team members found"}
        loadingMessage={() => "Loading team members..."}
      />
    </div>
  )
}

export default TeamMemberSelector