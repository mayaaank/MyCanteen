"use client";

import { useState } from "react";

export default function PollPage() {
  const [attendance, setAttendance] = useState("");
  const [portion, setPortion] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!attendance || !portion) {
      setMessage("⚠️ Please select both attendance and portion.");
      return;
    }

    setMessage(`✅ Response submitted!\nAttendance: ${attendance}, Portion: ${portion}`);
    setAttendance("");
    setPortion("");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-blue-50 px-4 py-10">
      <h1 className="text-3xl font-bold text-blue-700 mb-2">Mess Attendance</h1>
      <p className="text-gray-600 text-base mb-6">
        Kindly confirm your attendance and portion size for today&rsquo;s meal.
      </p>

      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
        {/* Attendance Section */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Will you attend?</h2>
          <div className="flex flex-col gap-2">
            {["yes", "no"].map((option) => (
              <label key={option} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="attendance"
                  value={option}
                  checked={attendance === option}
                  onChange={() => setAttendance(option)}
                  className="accent-blue-600"
                />
                <span className="text-gray-700 capitalize">{option}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Portion Section */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Portion Size</h2>
          <div className="flex flex-col gap-2">
            {["full", "half"].map((option) => (
              <label key={option} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="portion"
                  value={option}
                  checked={portion === option}
                  onChange={() => setPortion(option)}
                  className="accent-blue-600"
                />
                <span className="text-gray-700">
                  {option === "full" ? "Full Plate" : "Half Plate"}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg text-sm transition-colors duration-200"
        >
          Submit Response
        </button>

        {/* Message */}
        {message && (
          <div className="text-center text-blue-600 text-sm font-medium mt-4 whitespace-pre-line">
            {message}
          </div>
        )}
      </form>
    </div>
  );
}
