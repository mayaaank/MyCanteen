'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { UserPlus, LogOut, Eye } from 'lucide-react'

export default function AdminDashboard() {
  const router = useRouter()
  const supabase = createClientComponentClient()

  const [users, setUsers] = useState([])
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const [selectedUser, setSelectedUser] = useState(null) // for modal


  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }
      setCurrentUser(user)

      const { data, error } = await supabase.from('profiles_new').select('*')
      if (error) {
        console.error('Error fetching profiles_new:', error.message)
      } else {
        setUsers(data)
      }
      setLoading(false)
    }

    // inside AdminDashboard component
const handleCreateUser = async (formData) => {
  try {
    const res = await fetch('/api/create-profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: formData.email,            // required
        password: formData.password,      // required
        name: formData.full_name,         // required
        dept: formData.dept,
        year: formData.year,
        phone: formData.phone,
        role: formData.role || 'user'     // default role user

      })
    })

    const data = await res.json()
    if (res.ok) {
      alert('✅ User created successfully')
    } else {
      alert(`❌ Error: ${data.error}`)
    }
  } catch (err) {
    console.error('Error creating user:', err)
  }
}


    fetchData()
  }, [router, supabase])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (loading) return <p className="p-4">Loading...</p>

  return (
    <div className="p-4 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-3">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <div className="flex gap-3">
          <button
            onClick={() => router.push('/admin/create-user')}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
          >
            <UserPlus size={18} /> Create User
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg shadow hover:bg-red-700 transition"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </div>


      {/* Total Users */}
      <div className="bg-gray-100 rounded-xl p-4 shadow mb-6 text-center">
        <h2 className="text-lg font-semibold">Total Users</h2>
        <p className="text-2xl font-bold">{users.length}</p>
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto">
        <table className="w-full border rounded-lg shadow-sm text-sm sm:text-base">
          <thead className="bg-gray-200">
            <tr>
              <th className="border p-2">ID</th>
              <th className="border p-2">Name</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Phone</th>
              <th className="border p-2">Role</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-gray-50">
                <td className="border p-2">{u.id}</td>
                <td className="border p-2">{u.name}</td>
                <td className="border p-2">{u.email}</td>
                <td className="border p-2">{u.phone}</td>
                <td className="border p-2">{u.role}</td>
                <td className="border p-2 text-center">
                  <button
                    onClick={() => setSelectedUser(u)}
                    className="flex items-center gap-1 bg-indigo-600 text-white px-3 py-1 rounded-lg shadow hover:bg-indigo-700 transition mx-auto"
                  >
                    <Eye size={16} /> View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>


      {/* Modal for User Details */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 relative">
            <h2 className="text-xl font-bold mb-4">User Details</h2>
            <p><span className="font-semibold">ID:</span> {selectedUser.id}</p>
            <p><span className="font-semibold">Name:</span> {selectedUser.name}</p>
            <p><span className="font-semibold">Email:</span> {selectedUser.email}</p>
            <p><span className="font-semibold">Phone:</span> {selectedUser.phone}</p>
            <p><span className="font-semibold">Role:</span> {selectedUser.role}</p>
            <div className="mt-4 text-right">
              <button
                onClick={() => setSelectedUser(null)}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
