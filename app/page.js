'use client'

import { useRouter } from 'next/navigation'

export default function LandingPage() {
  const router = useRouter()

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-white text-center px-4">
      <h1 className="text-4xl font-bold mb-6 text-blue-700">Welcome to MyCanteen</h1>
      <p className="text-gray-600 mb-8 max-w-md">
        Your one-stop solution for managing daily meals, attendance, and billing in your institute canteen.
      </p>

      <button
        onClick={() => router.push('/signup')}
        className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-all"
      >
        Sign Up Now
      </button>
    </main>
  )
}
