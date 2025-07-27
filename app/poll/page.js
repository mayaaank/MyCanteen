export default function PollPage() {
  return (
    <div className="pt-20 pb-24 px-6 text-center">
      <h1 className="text-3xl font-bold text-purple-600 mb-4">Mess Attendance</h1>
      <p className="text-gray-700 mb-6">Will you be coming for today's meal? Let us know below:</p>

      <form className="space-y-6 max-w-md mx-auto">
        <div className="text-left">
          <label className="block font-medium mb-2">Will you attend?</label>
          <label className="block">
            <input type="radio" name="attendance" value="yes" className="mr-2" />
            Yes
          </label>
          <label className="block">
            <input type="radio" name="attendance" value="no" className="mr-2" />
            No
          </label>
        </div>

        <div className="text-left">
          <label className="block font-medium mb-2">Portion size:</label>
          <label className="block">
            <input type="radio" name="portion" value="full" className="mr-2" />
            Full Plate
          </label>
          <label className="block">
            <input type="radio" name="portion" value="half" className="mr-2" />
            Half Plate
          </label>
        </div>

        <button
          type="submit"
          className="mt-4 px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
        >
          Submit Response
        </button>
      </form>
    </div>
  );
}
