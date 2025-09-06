export default function ActionCards({ userStats, onSubmitResponse }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Today's Menu Card */}
      <div className="bg-blue-50 p-6 rounded-lg text-center shadow hover:shadow-md transition">
        <h4 className="text-lg font-bold text-blue-700">Today&apos;s Menu</h4>
        <p className="text-sm text-blue-600 mt-2">View current and upcoming meals</p>
      </div>

      {/* Meal History Card */}
      <div className="bg-green-50 p-6 rounded-lg text-center shadow hover:shadow-md transition">
        <h4 className="text-lg font-bold text-green-700">Meal History</h4>
        <p className="text-sm text-green-600 mt-2">Check your dining records</p>
      </div>

      {/* Poll Response Card */}
      <button
        onClick={onSubmitResponse}
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
  )
}