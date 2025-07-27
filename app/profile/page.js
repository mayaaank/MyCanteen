export default function ProfilePage() {
  return (
    <div className="pt-20 pb-24 px-6 text-center"> {/* padding adjusted */}
      <h1 className="text-3xl font-bold text-blue-600 mb-4">Your Profile</h1>
      <p className="text-gray-700 mb-6">Check your details and meal history.</p>

      <div className="max-w-md mx-auto p-4 border rounded shadow">
        <h2 className="text-xl font-semibold mb-2">👋 Hi, Arvind!</h2>
        <p><strong>Student ID:</strong> 2025CSE001</p>
        <p><strong>Meals Availed:</strong> 14 this month</p>
        <p><strong>Favorite Dish:</strong> Paneer Butter Masala</p>
      </div>
    </div>
  );
}
