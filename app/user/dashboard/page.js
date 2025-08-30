'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default function UserDashboard() {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Poll states
  const [pollOpen, setPollOpen] = useState(false)
  const [attendance, setAttendance] = useState('yes')
  const [mealType, setMealType] = useState('full')
  const [sessionType, setSessionType] = useState('lunch')
  const [pollLoading, setPollLoading] = useState(false)
  const [pollMessage, setPollMessage] = useState('')

  // User stats
  const [userStats, setUserStats] = useState({
    totalBill: 0,
    thisMonthMeals: 0,
    lastPoll: null,
    pendingPolls: 0
  })

  useEffect(() => {
    checkAuthAndLoadData()
  }, [])

  const checkAuthAndLoadData = async () => {
    try {
      setLoading(true)
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login')
        return
      }

      // ✅ Fetch profile from profiles_new table
      const { data: profile, error } = await supabase
        .from('profiles_new')
        .select('*')
        .eq('email', user.email)
        .single()

      if (error || !profile) {
        router.push('/unauthorized')
        return
      }

      if (profile.role !== 'user') {
        router.push('/unauthorized')
        return
      }

      setCurrentUser({
        id: profile.id,
        email: user.email,
        name: profile.full_name || user.email.split('@')[0],
        role: profile.role
      })

      await loadUserStats(profile.id)
    } catch (err) {
      console.error('Error fetching user:', err)
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }

  const loadUserStats = async (profileId) => {
    try {
      // Profile data
      const { data: profile } = await supabase
        .from('profiles_new')
        .select('total_bill, last_poll_at')
        .eq('id', profileId)
        .single()

      // This month's meals
      const thisMonthStart = new Date()
      thisMonthStart.setDate(1)
      const thisMonthISO = thisMonthStart.toISOString().split('T')[0]

      const { count: monthlyMeals } = await supabase
        .from('transactions')
        .select('*', { count: 'exact' })
        .eq('profile_id', profileId)
        .gte('meal_date', thisMonthISO)

      // Pending polls
      const { count: pendingCount } = await supabase
        .from('polls')
        .select('*', { count: 'exact' })
        .eq('profile_id', profileId)
        .eq('status', 'pending')

      // Latest poll
      const { data: latestPoll } = await supabase
        .from('polls')
        .select('*')
        .eq('profile_id', profileId)
        .order('created_at', { ascending: false })
        .limit(1)

      setUserStats({
        totalBill: profile?.total_bill || 0,
        thisMonthMeals: monthlyMeals || 0,
        lastPoll: latestPoll?.[0] || null,
        pendingPolls: pendingCount || 0
      })
    } catch (err) {
      console.error('Error loading user stats:', err)
    }
  }

  const handleSubmitPoll = async () => {
    setPollMessage('')

    if (!currentUser) {
      setPollMessage('You must be logged in.')
      return
    }

    if (attendance === 'no') {
      setPollMessage('Noted: You chose not to attend tomorrow.')
      setTimeout(() => setPollOpen(false), 1500)
      return
    }

    setPollLoading(true)
    try {
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      const mealDate = tomorrow.toISOString().split('T')[0]

      const payload = {
        profile_id: currentUser.id,
        meal_date: mealDate,
        session: sessionType,
        meal_type: mealType,
        status: 'pending'
      }

      const { error } = await supabase.from('polls').insert(payload)

      if (error) {
        if (error.code === '23505') {
          setPollMessage('You already voted for this session tomorrow. Updating your choice...')

          const { error: updateError } = await supabase
            .from('polls')
            .update({ meal_type: mealType })
            .eq('profile_id', currentUser.id)
            .eq('meal_date', mealDate)
            .eq('session', sessionType)

          if (updateError) {
            setPollMessage(`Update failed: ${updateError.message}`)
          } else {
            setPollMessage('Your vote has been updated!')
            await loadUserStats(currentUser.id)
            setTimeout(() => setPollOpen(false), 1500)
          }
        } else {
          setPollMessage(`Error: ${error.message}`)
        }
      } else {
        setPollMessage(`Vote submitted for tomorrow's ${sessionType}!`)
        await loadUserStats(currentUser.id)
        setTimeout(() => setPollOpen(false), 1500)
      }
    } catch (err) {
      console.error(err)
      setPollMessage('Unexpected error while submitting poll.')
    } finally {
      setPollLoading(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Canteen Dashboard</h1>
              <p className="text-sm text-gray-600">Welcome, {currentUser?.name}</p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900">Total Bill</h3>
            <p className="text-3xl font-bold text-green-600 mt-2">
              ₹{userStats.totalBill}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900">This Month</h3>
            <p className="text-3xl font-bold text-blue-600 mt-2">
              {userStats.thisMonthMeals} meals
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900">Pending Votes</h3>
            <p className="text-3xl font-bold text-yellow-600 mt-2">
              {userStats.pendingPolls}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900">Last Vote</h3>
            <p className="text-sm text-gray-600 mt-2">
              {userStats.lastPoll ? (
                <>
                  <span className="capitalize">{userStats.lastPoll.session}</span> - {userStats.lastPoll.meal_type}
                  <br />
                  <span className="text-xs">{new Date(userStats.lastPoll.created_at).toLocaleDateString()}</span>
                </>
              ) : (
                'No votes yet'
              )}
            </p>
          </div>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-50 p-6 rounded-lg text-center shadow hover:shadow-md transition">
            <h4 className="text-lg font-bold text-blue-700">Today&apos;s Menu</h4>
            <p className="text-sm text-blue-600 mt-2">View current and upcoming meals</p>
          </div>

          <div className="bg-green-50 p-6 rounded-lg text-center shadow hover:shadow-md transition">
            <h4 className="text-lg font-bold text-green-700">Meal History</h4>
            <p className="text-sm text-green-600 mt-2">Check your dining records</p>
          </div>

          <button
            onClick={() => setPollOpen(true)}
            className="bg-yellow-50 p-6 rounded-lg text-center shadow hover:shadow-md transition"
          >
            <h4 className="text-lg font-bold text-yellow-700">Vote for Tomorrow</h4>
            <p className="text-sm text-yellow-600 mt-2">Submit your meal preference</p>
          </button>
        </div>

        {/* Quick Info */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Info</h3>
          <div className="space-y-2 text-sm text-gray-600">
            <p>• Poll voting is for tomorrow&apos;s meals</p>
            <p>• You can change your vote until the admin confirms</p>
            <p>• Full meal: ₹60 | Half meal: ₹45</p>
            <p>• Lunch voting closes at 2 PM, Dinner at 6 PM</p>
          </div>
        </div>
      </main>

      {/* Poll Modal */}
      {pollOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => !pollLoading && setPollOpen(false)} />
          <div className="relative bg-white w-full max-w-md rounded-lg shadow-lg p-6 z-10">
            <h3 className="text-lg font-semibold mb-4">Vote for Tomorrow&apos;s Meal</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Session</label>
                <select
                  value={sessionType}
                  onChange={(e) => setSessionType(e.target.value)}
                  className="w-full border rounded-md px-3 py-2"
                  disabled={pollLoading}
                >
                  <option value="lunch">Lunch</option>
                  <option value="dinner">Dinner</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Will you attend?</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="attendance"
                      value="yes"
                      checked={attendance === 'yes'}
                      onChange={(e) => setAttendance(e.target.value)}
                      disabled={pollLoading}
                    />
                    <span>Yes</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="attendance"
                      value="no"
                      checked={attendance === 'no'}
                      onChange={(e) => setAttendance(e.target.value)}
                      disabled={pollLoading}
                    />
                    <span>No</span>
                  </label>
                </div>
              </div>

              {attendance === 'yes' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Meal Type</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="mealType"
                        value="full"
                        checked={mealType === 'full'}
                        onChange={(e) => setMealType(e.target.value)}
                        disabled={pollLoading}
                      />
                      <span>Full (₹60)</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="mealType"
                        value="half"
                        checked={mealType === 'half'}
                        onChange={(e) => setMealType(e.target.value)}
                        disabled={pollLoading}
                      />
                      <span>Half (₹45)</span>
                    </label>
                  </div>
                </div>
              )}

              {pollMessage && (
                <div className="text-sm text-center p-2 bg-gray-100 rounded">{pollMessage}</div>
              )}

              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  onClick={() => setPollOpen(false)}
                  disabled={pollLoading}
                  className="px-4 py-2 rounded border hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitPoll}
                  disabled={pollLoading}
                  className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  {pollLoading ? 'Submitting...' : 'Submit Vote'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
