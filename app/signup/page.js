'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@lib/supabase'

export default function SignupPage() {
  const [userID, setUserID] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSignup = async (e) => {
    e.preventDefault()
    setError('')

    try {
      // 1. Check if user ID exists and not claimed
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('unique_id', userID)
        .single()

      if (error || !data) {
        setError('User ID not found. Please contact admin.')
        return
      }

      if (data.password) {
        setError('This ID has already been used. Please log in instead.')
        return
      }

      // 2. Update name and password
      const { error: updateError } = await supabase
        .from('users')
        .update({
          name: name,
          password: password
        })
        .eq('unique_id', userID)

      if (updateError) {
        setError('Failed to complete signup. Try again.')
        return
      }

      router.push('/login')

    } catch (err) {
      console.error(err)
      setError('Unexpected error occurred.')
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSignup}
        className="bg-white p-8 rounded shadow-md w-full max-w-md"
      >
        <h1 className="text-2xl font-bold mb-6 text-center">Sign Up</h1>

        <input
          type="text"
          placeholder="User ID"
          value={userID}
          onChange={(e) => setUserID(e.target.value)}
          required
          className="w-full mb-4 px-4 py-2 border border-gray-300 rounded"
        />

        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full mb-4 px-4 py-2 border border-gray-300 rounded"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full mb-4 px-4 py-2 border border-gray-300 rounded"
        />

        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
        >
          Sign Up
        </button>
      </form>
    </div>
  )
}
