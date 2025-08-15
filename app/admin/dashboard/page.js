'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default function AdminDashboard() {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [users, setUsers] = useState([])
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState(null)

  useEffect(() => {
    checkAuthAndLoadData()
  }, [])

  const loadUsers = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, email, full_name, role, created_at, contact_number, department, academic_year")
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching users:", error)
        return
      }

      setUsers(data)
    } catch (err) {
      console.error("Unexpected error loading users:", err)
    }
  }

const checkAuthAndLoadData = async () => {
  try {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()

    if (sessionError || !session) {
      console.warn('No valid session found. Redirecting to login.')
      router.push('/login')
      return
    }

    const user = session.user

    // Check if user is admin
    if (user.user_metadata?.role !== 'admin') {
      router.push('/unauthorized')
      return
    }

    setCurrentUser({
      id: user.id,
      email: user.email,
      name: user.user_metadata?.name || user.email.split('@')[0]
    })

    await loadUsers()
  } catch (error) {
    console.error('Error checking auth:', error)
    router.push('/login')
  } finally {
    setLoading(false)
  }
}

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-sm text-gray-600">Welcome back, {currentUser?.name}</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/admin/create-user')}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Add New User
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900">Total Users</h3>
            <p className="text-3xl font-bold text-blue-600 mt-2">{users.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900">Active Users</h3>
            <p className="text-3xl font-bold text-green-600 mt-2">{users.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900">Admin Panel</h3>
            <p className="text-sm text-gray-600 mt-2">Manage your canteen system</p>
          </div>
        </div>

        {/* Users List */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Registered Users</h2>
          </div>
          
          <div className="p-6">
            {users.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No users registered yet.</p>
                <button
                  onClick={() => router.push('/admin/create-user')}
                  className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Create First User
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {users.map(user => (
                  <div
                    key={user.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md cursor-pointer transition-shadow"
                    onClick={() => setSelectedUser(user)}
                  >
                    <div>
                      <h3 className="font-semibold text-gray-900">{user.full_name || user.email.split("@")[0]}</h3>
                      <p className="text-sm text-gray-600">{user.email}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Joined: {new Date(user.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="mt-3">
                      <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                        {user.role}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {selectedUser && (
            <div className="mt-8 bg-white shadow rounded-lg p-6 border max-w-lg">
              <h2 className="text-xl font-bold mb-4">{selectedUser.full_name}</h2>
              <p><strong>Email:</strong> {selectedUser.email}</p>
              <p><strong>Role:</strong> {selectedUser.role}</p>
              <p><strong>Contact:</strong> {selectedUser.contact_number || "N/A"}</p>
              <p><strong>Department:</strong> {selectedUser.department || "N/A"}</p>
              <p><strong>Academic Year:</strong> {selectedUser.academic_year || "N/A"}</p>
              <button
                className="mt-4 bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
                onClick={() => setSelectedUser(null)}
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}