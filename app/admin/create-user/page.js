'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function CreateUser() {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    userID: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Check if user is admin
    const user = JSON.parse(localStorage.getItem('currentUser'))
    if (!user || user.role !== 'admin') {
      router.push('/login')
      return
    }
    setCurrentUser(user)
  }, [router])

  const generateUserID = () => {
    const timestamp = Date.now().toString().slice(-6)
    const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
    return `USER${timestamp}${randomNum}`
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    setError('')
    setSuccess('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      // Validation
      if (!formData.name.trim()) {
        setError('Name is required')
        setLoading(false)
        return
      }

      if (!formData.userID.trim()) {
        setError('User ID is required')
        setLoading(false)
        return
      }

      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters long')
        setLoading(false)
        return
      }

      // Check if user ID already exists
      const existingUsers = JSON.parse(localStorage.getItem('users')) || []
      const userExists = existingUsers.some(user => user.id === formData.userID)

      if (userExists) {
        setError('User ID already exists. Please choose another.')
        setLoading(false)
        return
      }

      // Create new user
      const newUser = {
        id: formData.userID,
        name: formData.name.trim(),
        password: formData.password,
        role: 'user',
        createdAt: new Date().toISOString(),
        createdBy: currentUser.id,
        status: 'active'
      }

      // Save to localStorage
      const updatedUsers = [...existingUsers, newUser]
      localStorage.setItem('users', JSON.stringify(updatedUsers))

      setSuccess(`User "${formData.name}" created successfully with ID: ${formData.userID}`)
      
      // Reset form
      setFormData({
        name: '',
        userID: '',
        password: ''
      })

    } catch (err) {
      setError('Failed to create user. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateID = () => {
    const newID = generateUserID()
    setFormData(prev => ({
      ...prev,
      userID: newID
    }))
  }

  if (!currentUser) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button
                onClick={() => router.push('/admin/dashboard')}
                className="mr-4 p-2 text-gray-600 hover:text-gray-900"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Create New User</h1>
                <p className="text-sm text-gray-600">Add a new user to the canteen system</p>
              </div>
            </div>
            <button
              onClick={() => router.push('/admin/dashboard')}
              className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">User Information</h2>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mb-6">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-md mb-6">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                placeholder="Enter user's full name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                User ID *
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  name="userID"
                  value={formData.userID}
                  onChange={handleInputChange}
                  required
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                  placeholder="Enter unique user ID"
                />
                <button
                  type="button"
                  onClick={handleGenerateID}
                  className="bg-blue-100 text-blue-600 px-4 py-3 rounded-md hover:bg-blue-200 transition-colors whitespace-nowrap"
                >
                  Generate ID
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password *
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                minLength={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                placeholder="Create password for user"
              />
            </div>

            <div className="flex space-x-4 pt-6">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Creating User...' : 'Create User'}
              </button>
              <button
                type="button"
                onClick={() => router.push('/admin/dashboard')}
                className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-md hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}