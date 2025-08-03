export default function MenuPage() {
  return (
    <div className="p-6 text-center">
      <h1 className="text-3xl font-bold text-orange-600 mb-4">Today&rsquo;s Menu</h1>
      <p className="text-gray-700 mb-6">Check out what&rsquo;s being served today at the canteen!</p>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        <div className="p-4 border rounded-lg shadow hover:shadow-md transition">
          <h2 className="text-xl font-semibold">Veg Thali</h2>
          <p className="text-sm text-gray-500">Includes dal, rice, roti & sabzi</p>
        </div>
        <div className="p-4 border rounded-lg shadow hover:shadow-md transition">
          <h2 className="text-xl font-semibold">Paneer Roll</h2>
          <p className="text-sm text-gray-500">Delicious stuffed paneer roll</p>
        </div>
        <div className="p-4 border rounded-lg shadow hover:shadow-md transition">
          <h2 className="text-xl font-semibold">Cold Coffee</h2>
          <p className="text-sm text-gray-500">Perfect drink for a sunny day</p>
        </div>
      </div>
    </div>
  );
}