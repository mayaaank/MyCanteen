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
  const [search, setSearch] = useState("")
  const [error, setError] = useState(null)

  useEffect(() => {
    checkAuthAndLoadData()
  }, [])

  // Fetch users from Supabase profiles table
  const loadUsers = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, user_id, full_name, email, contact_number, department, academic_year, role, last_poll_at")
        .neq('role', 'admin')
        .order("created_at", { ascending: false })

      if (error) throw error
      setUsers(data || [])
    } catch (err) {
      console.error("Error loading users:", err)
      setError(err.message || 'Failed to load users')
      setUsers([])
    }
  }

  // Admin auth & load users
  const checkAuthAndLoadData = async () => {
    try {
      setLoading(true)
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      if (sessionError || !session) throw new Error('Please login')

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .maybeSingle()

      if (!profile) throw new Error('Profile not found')

      if (profile.role !== 'admin') throw new Error('Admin access required')

      setCurrentUser({ 
        id: session.user.id, 
        email: session.user.email, 
        name: profile.full_name, 
        role: profile.role 
      })

      await loadUsers()
    } catch (err) {
      console.error(err)
      setError(err.message)
      if (!err.message.includes('profile')) router.push('/login')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  // Filter users based on search input
  const filteredUsers = users.filter(user =>
    user.user_id?.toLowerCase().includes(search.toLowerCase()) ||
    user.full_name?.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  )

  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <p className="text-red-500 mb-4">{error}</p>
        <div className="flex justify-center gap-2">
          <button onClick={() => window.location.reload()} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Try Again</button>
          <button onClick={handleLogout} className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700">Login Page</button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between h-16 items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-sm text-gray-600">Welcome, {currentUser?.name}</p>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={() => router.push('/admin/create-user')} 
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Add User
            </button>
            <button 
              onClick={handleLogout} 
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900">Total Users</h3>
            <p className="text-3xl font-bold text-blue-600 mt-2">{users.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900">Active Users</h3>
            {/* Placeholder: all users considered active for now */}
            <p className="text-3xl font-bold text-green-600 mt-2">{users.length}</p>
          </div>
        </div>

        {/* Search */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search by User ID or Name"
            className="border border-gray-300 p-2 rounded w-full md:w-64"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* User Table */}
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg bg-white">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3">User ID</th>
                <th scope="col" className="px-6 py-3">Name</th>
                <th scope="col" className="px-6 py-3">Last Poll</th>
                <th scope="col" className="px-6 py-3"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user.id} className="bg-white border-b border-gray-200 hover:bg-gray-50">
                  <th className="px-6 py-4 font-medium text-gray-900">{user.user_id}</th>
                  <td className="px-6 py-4">{user.full_name || "-"}</td>
                  <td className="px-6 py-4">{user.last_poll_at ? new Date(user.last_poll_at).toLocaleString() : 'N/A'}</td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => setSelectedUser(user)}
                      className="font-medium text-blue-600 hover:underline"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* View/Edit Card */}
        {selectedUser && (
          <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md p-6 bg-white rounded-lg shadow-lg border">
            <button 
              onClick={() => setSelectedUser(null)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
            <h2 className="text-xl font-bold mb-2">{selectedUser.full_name}</h2>
            <p><strong>Email:</strong> {selectedUser.email}</p>
            <p><strong>Contact:</strong> {selectedUser.contact_number || 'N/A'}</p>
            <p><strong>Department:</strong> {selectedUser.department || 'N/A'}</p>
            <p><strong>Year:</strong> {selectedUser.academic_year || 'N/A'}</p>
            <p><strong>Last Poll:</strong> {selectedUser.last_poll_at ? new Date(selectedUser.last_poll_at).toLocaleString() : 'N/A'}</p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => router.push(`/admin/edit-user/${selectedUser.id}`)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Edit
              </button>
              <button
                onClick={() => setSelectedUser(null)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        )}

      </main>
    </div>
  )
}
