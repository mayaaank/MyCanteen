"use client";

import { useState, useEffect } from "react";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function PollPage() {
  const [attendance, setAttendance] = useState("");
  const [portion, setPortion] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [existingResponse, setExistingResponse] = useState(null);

  const supabase = createClientComponentClient();

  useEffect(() => {
    // Get current user and check for existing response
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        await checkExistingResponse(user.id);
      }
    };

    getCurrentUser();
  }, []);

  const checkExistingResponse = async (userId) => {
    const today = new Date().toISOString().slice(0, 10);
    
    const { data, error } = await supabase
      .from('poll_responses')
      .select('*')
      .eq('user_id', userId)
      .eq('date', today)
      .single();

    if (data && !error) {
      setExistingResponse(data);
      setAttendance(data.present ? 'yes' : 'no');
      setPortion(data.portion_size);
      setMessage("You have already submitted your response for today. You can update it below.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!attendance || !portion) {
      setMessage("⚠️ Please select both attendance and portion.");
      setLoading(false);
      return;
    }

    if (!user) {
      setMessage("⚠️ You must be logged in to submit a poll response.");
      setLoading(false);
      return;
    }

    const today = new Date().toISOString().slice(0, 10);
    const pollData = {
      user_id: user.id,
      date: today,
      present: attendance === 'yes',
      portion_size: portion,
      confirmation_status: 'pending'
    };

    try {
      const { data, error } = await supabase
        .from('poll_responses')
        .upsert(pollData, { 
          onConflict: 'user_id,date',
          ignoreDuplicates: false 
        });

      if (error) {
        console.error('Error submitting poll:', error);
        setMessage("❌ Error submitting response. Please try again.");
      } else {
        setMessage(existingResponse 
          ? `✅ Response updated!\nAttendance: ${attendance === 'yes' ? 'Present' : 'Absent'}, Portion: ${portion} plate`
          : `✅ Response submitted!\nAttendance: ${attendance === 'yes' ? 'Present' : 'Absent'}, Portion: ${portion} plate`
        );
        setExistingResponse(data);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      setMessage("❌ Unexpected error occurred. Please try again.");
    }

    setLoading(false);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-blue-50 px-4 py-10">
        <h1 className="text-3xl font-bold text-blue-700 mb-2">Please log in</h1>
        <p className="text-gray-600 text-base mb-6">
          You need to be logged in to submit a poll response.
        </p>
      </div>
    );
  }

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
                  disabled={loading}
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
                  disabled={loading}
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
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 rounded-lg text-sm transition-colors duration-200"
        >
          {loading ? "Submitting..." : existingResponse ? "Update Response" : "Submit Response"}
        </button>

        {/* Message */}
        {message && (
          <div className={`text-center text-sm font-medium mt-4 whitespace-pre-line ${
            message.includes('❌') || message.includes('⚠️') 
              ? 'text-red-600' 
              : 'text-blue-600'
          }`}>
            {message}
          </div>
        )}
      </form>
    </div>
  );
}