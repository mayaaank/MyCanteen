'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '../../components/Navbar'

export default function LoginPage() {
  const router = useRouter()
  const [userID, setUserID] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleLogin = (e) => {
    e.preventDefault()
    
    const users = JSON.parse(localStorage.getItem('users')) || []
    const user = users.find(u => u.id === userID && u.password === password)

    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user))
      router.push('/dashboard')
    } else {
      setError('Invalid credentials. Please try again.')
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow bg-gradient-to-br from-blue-100 to-white flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-md">
          <h1 className="text-3xl font-bold text-center mb-4 text-blue-700">Login</h1>

          {error && (
            <p className="text-sm text-red-500 mb-4 text-center">{error}</p>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">User ID</label>
              <input
                type="text"
                value={userID}
                onChange={(e) => setUserID(e.target.value)}
                required
                className="w-full px-4 text-black py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Your User ID"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 text-black py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Your Password"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Login
            </button>

            <p className="text-sm text-center mt-2 text-gray-600">
              Don't have an account? <a href="/signup" className="text-blue-600 hover:underline">Sign up</a>
            </p>
          </form>
        </div>
      </main>
    </div>
  )
}