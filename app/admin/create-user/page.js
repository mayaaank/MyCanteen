'use client'

import { useState } from 'react'

export default function CreateUserPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: '',
    dept: '',
    year: '',
    contact_number: '',
    role: 'user',
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
  e.preventDefault()
  setLoading(true)
  setMessage(null)

  try {
    const res = await fetch('/api/create-profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })

    const result = await res.json()

    if (!res.ok) {
      throw new Error(result.error || 'Failed to create user')
    }

    // Show the SMC user_id returned from backend
    setMessage(`✅ User created successfully: ${result.user_id}`)

    // Reset form
    setFormData({
      email: '',
      password: '',
      full_name: '',
      dept: '',
      year: '',
      contact_number: '',
      role: 'user'
    })
  } catch (err) {
    setMessage(`❌ Error: ${err.message}`)
  } finally {
    setLoading(false)
  }
}

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow">
      <h1 className="text-xl font-bold mb-4">Create New User</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="full_name"
          placeholder="Full Name"
          value={formData.full_name}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          name="dept"
          placeholder="Department"
          value={formData.dept}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="year"
          placeholder="Academic Year"
          value={formData.year}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="contact_number"
          placeholder="Phone Number"
          value={formData.contact_number}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

      
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Creating...' : 'Create User'}
        </button>
      </form>

      {message && <p className="mt-4 text-center">{message}</p>}
    </div>
  )
}
