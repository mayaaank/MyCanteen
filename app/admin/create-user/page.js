'use client'

import { useState, useEffect, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { createUserServerAction } from './server' // server-side function

export default function CreateUser() {
  const router = useRouter()
  const supabase = createClientComponentClient()

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    department: '',
    academic_year: '',
    contact_number: '',
  })

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    // Optional: Add admin role check here
  }, [router, supabase])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setError('')
    setSuccess('')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.department ||
      !formData.academic_year ||
      !formData.contact_number ||
      formData.password.length < 6
    ) {
      setError('All fields are required. Password must be ≥ 6 characters.')
      return
    }

    startTransition(async () => {
      const result = await createUserServerAction(formData)

      if (result.error) {
        setError(result.error)
      } else {
        setSuccess('User created successfully.')
        setFormData({
          name: '',
          email: '',
          password: '',
          department: '',
          academic_year: '',
          contact_number: '',
        })
      }
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2m-6 4h6" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Create New User</h2>
        </div>

        {/* Form Card */}
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}
          {success && (
            <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-4">
              <p className="text-sm text-green-700">{success}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Full Name"
                required
                className="w-full px-4 py-3 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter your email"
                className="w-full px-4 py-3 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                required
                minLength={6}
                className="w-full px-4 py-3 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Department */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Department</label>
              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleChange}
                placeholder="e.g. Computer Science"
                required
                className="w-full px-4 py-3 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Academic Year */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Academic Year</label>
              <input
                type="text"
                name="academic_year"
                value={formData.academic_year}
                onChange={handleChange}
                placeholder="e.g. Second Year"
                required
                className="w-full px-4 py-3 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Contact Number */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Contact Number</label>
              <input
                type="tel"
                name="contact_number"
                value={formData.contact_number}
                onChange={handleChange}
                placeholder="10-digit phone number"
                required
                pattern="[0-9]{10}"
                className="w-full px-4 py-3 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isPending ? 'Creating...' : 'Create User'}
            </button>
          </form>
        </div>

        <div className="text-center mt-8 text-sm text-gray-500">
          Powered by Swifty9 • PVG Canteen Management
        </div>
      </div>
    </div>
  )
}
