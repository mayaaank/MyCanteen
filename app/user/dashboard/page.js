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
  const [pollLoading, setPollLoading] = useState(false)
  const [pollMessage, setPollMessage] = useState('')

  // User stats
  const [userStats, setUserStats] = useState({
    totalBill: 0,
    thisMonthMeals: 0,
    todaysPollResponse: null,
    confirmationStatus: null
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
        id: user.id, // Use auth user ID for poll_responses
        profile_id: profile.id, // Keep profile ID for other queries
        email: user.email,
        name: profile.full_name || user.email.split('@')[0],
        role: profile.role
      })

      await loadUserStats(user.id, profile.id)
    } catch (err) {
      console.error('Error fetching user:', err)
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }

  const loadUserStats = async (userId, profileId) => {
    try {
      // Profile data
      const { data: profile } = await supabase
        .from('profiles_new')
        .select('total_bill')
        .eq('id', profileId)
        .single()

      // This month's meals from transactions
      const thisMonthStart = new Date()
      thisMonthStart.setDate(1)
      const thisMonthISO = thisMonthStart.toISOString().split('T')[0]

      const { count: monthlyMeals } = await supabase
        .from('transactions')
        .select('*', { count: 'exact' })
        .eq('profile_id', profileId)
        .gte('meal_date', thisMonthISO)

      // Today's poll response
      const today = new Date().toISOString().slice(0, 10)
      const { data: todaysPoll } = await supabase
        .from('poll_responses')
        .select('*')
        .eq('user_id', userId)
        .eq('date', today)
        .single()

      setUserStats({
        totalBill: profile?.total_bill || 0,
        thisMonthMeals: monthlyMeals || 0,
        todaysPollResponse: todaysPoll,
        confirmationStatus: todaysPoll?.confirmation_status || null
      })

      // Set form values if poll response exists
      if (todaysPoll) {
        setAttendance(todaysPoll.present ? 'yes' : 'no')
        setMealType(todaysPoll.portion_size)
      }
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

    setPollLoading(true)
    try {
      const today = new Date().toISOString().slice(0, 10)

      const payload = {
        user_id: currentUser.id,
        date: today,
        present: attendance === 'yes',
        portion_size: mealType,
        confirmation_status: 'pending'
      }

      // Use upsert to handle both insert and update
      const { error } = await supabase
        .from('poll_responses')
        .upsert(payload, { 
          onConflict: 'user_id,date',
          ignoreDuplicates: false 
        })

      if (error) {
        setPollMessage(`Error: ${error.message}`)
      } else {
        const isUpdate = userStats.todaysPollResponse !== null
        setPollMessage(
          attendance === 'no' 
            ? 'Noted: You chose not to attend today.'
            : `${isUpdate ? 'Updated' : 'Submitted'} your response for today's meal!`
        )
        
        await loadUserStats(currentUser.id, currentUser.profile_id)
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

  const getConfirmationBadge = (status) => {
    if (!status) return null
    
    const badges = {
      pending: { color: 'bg-yellow-100 text-yellow-800', text: 'Pending Confirmation' },
      confirmed: { color: 'bg-green-100 text-green-800', text: 'Confirmed' }
    }
    
    const badge = badges[status]
    return (
      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${badge.color}`}>
        {badge.text}
      </span>
    )
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
        {/* Today's Poll Status */}
        {userStats.todaysPollResponse && (
          <div className="mb-8 bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Today&apos;s Poll Response</h3>
                <p className="text-sm text-gray-600 mt-1">
                  {userStats.todaysPollResponse.present ? 'Attending' : 'Not Attending'} • 
                  {userStats.todaysPollResponse.present && ` ${userStats.todaysPollResponse.portion_size} portion`}
                </p>
              </div>
              <div className="flex items-center gap-3">
                {getConfirmationBadge(userStats.confirmationStatus)}
                <button
                  onClick={() => setPollOpen(true)}
                  className="bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm"
                >
                  Update Response
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
            <h3 className="text-lg font-semibold text-gray-900">Today&apos;s Status</h3>
            <div className="mt-2">
              {userStats.todaysPollResponse ? (
                <div>
                  <p className="text-lg font-bold text-blue-600">
                    {userStats.todaysPollResponse.present ? 'Attending' : 'Not Attending'}
                  </p>
                  {getConfirmationBadge(userStats.confirmationStatus)}
                </div>
              ) : (
                <p className="text-lg font-bold text-yellow-600">No response yet</p>
              )}
            </div>
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
            <h4 className="text-lg font-bold text-yellow-700">
              {userStats.todaysPollResponse ? 'Update Response' : 'Submit Response'}
            </h4>
            <p className="text-sm text-yellow-600 mt-2">
              {userStats.todaysPollResponse ? 'Change your meal preference' : 'Submit your meal preference'}
            </p>
          </button>
        </div>

        {/* Quick Info */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Info</h3>
          <div className="space-y-2 text-sm text-gray-600">
            <p>• Poll responses are for today&apos;s meals</p>
            <p>• You can update your response until the admin confirms it</p>
            <p>• Full meal: ₹60 | Half meal: ₹45</p>
            <p>• Confirmed responses will be used for billing</p>
            <p>• {userStats.confirmationStatus === 'pending' ? 'Your response is pending admin confirmation' : 
                  userStats.confirmationStatus === 'confirmed' ? 'Your response has been confirmed' : 
                  'Submit your response to participate in today\'s meal'}</p>
          </div>
        </div>
      </main>

      {/* Poll Modal */}
      {pollOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => !pollLoading && setPollOpen(false)} />
          <div className="relative bg-white w-full max-w-md rounded-lg shadow-lg p-6 z-10">
            <h3 className="text-lg font-semibold mb-4">
              {userStats.todaysPollResponse ? 'Update Today\'s Response' : 'Submit Today\'s Response'}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Will you attend today?</label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Meal Size</label>
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

              {userStats.confirmationStatus === 'confirmed' && (
                <div className="bg-orange-50 border border-orange-200 rounded-md p-3">
                  <p className="text-sm text-orange-800">
                    ⚠️ Your previous response has already been confirmed by the admin. 
                    Updating will require new admin confirmation.
                  </p>
                </div>
              )}

              {pollMessage && (
                <div className={`text-sm text-center p-2 rounded ${
                  pollMessage.includes('Error') 
                    ? 'bg-red-100 text-red-800' 
                    : 'bg-green-100 text-green-800'
                }`}>
                  {pollMessage}
                </div>
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
                  {pollLoading ? 'Submitting...' : (userStats.todaysPollResponse ? 'Update Response' : 'Submit Response')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div> 
  )
}