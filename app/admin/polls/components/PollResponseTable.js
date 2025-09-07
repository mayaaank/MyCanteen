// components/polls/PollResponseTable.js
'use client';

import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { 
  User, 
  ToggleLeft, 
  ToggleRight, 
  Check, 
  Clock, 
  CheckCircle, 
  UserX,
  Users 
} from 'lucide-react';

export default function PollResponseTable({ data, onPollUpdate, loading, selectedDate }) {
  const [updatingPoll, setUpdatingPoll] = useState({});
  const supabase = createClientComponentClient();

  const handleAttendanceToggle = async (userId, currentAttendance, hasResponse) => {
    const updateKey = `${userId}_attendance`;
    setUpdatingPoll(prev => ({ ...prev, [updateKey]: true }));

    const newAttendance = !currentAttendance;

    try {
      if (hasResponse) {
        const { error } = await supabase
          .from('poll_responses')
          .update({ present: newAttendance })
          .eq('user_id', userId)
          .eq('date', selectedDate)
          .select();

        if (error) throw new Error(error.message);
      } else {
        const { error } = await supabase
          .from('poll_responses')
          .insert({
            user_id: userId,
            date: selectedDate,
            present: newAttendance,
            portion_size: 'full',
            confirmation_status: 'pending'
          })
          .select();

        if (error) throw new Error(error.message);
      }

      onPollUpdate();
    } catch (error) {
      console.error('Error updating attendance:', error);
      alert(`Failed to update attendance: ${error.message}`);
    } finally {
      setUpdatingPoll(prev => ({ ...prev, [updateKey]: false }));
    }
  };

  const handlePortionToggle = async (userId, currentPortion, hasResponse) => {
    const updateKey = `${userId}_portion`;
    setUpdatingPoll(prev => ({ ...prev, [updateKey]: true }));

    const newPortion = currentPortion === 'full' ? 'half' : 'full';

    try {
      if (hasResponse) {
        const { error } = await supabase
          .from('poll_responses')
          .update({ portion_size: newPortion })
          .eq('user_id', userId)
          .eq('date', selectedDate)
          .select();

        if (error) throw new Error(error.message);
      } else {
        const { error } = await supabase
          .from('poll_responses')
          .insert({
            user_id: userId,
            date: selectedDate,
            present: true,
            portion_size: newPortion,
            confirmation_status: 'pending'
          })
          .select();

        if (error) throw new Error(error.message);
      }

      onPollUpdate();
    } catch (error) {
      console.error('Error updating portion:', error);
      alert(`Failed to update portion: ${error.message}`);
    } finally {
      setUpdatingPoll(prev => ({ ...prev, [updateKey]: false }));
    }
  };

  const handleConfirmResponse = async (userId) => {
    const updateKey = `${userId}_confirm`;
    setUpdatingPoll(prev => ({ ...prev, [updateKey]: true }));

    try {
      const { error } = await supabase
        .from('poll_responses')
        .update({ confirmation_status: 'confirmed' })
        .eq('user_id', userId)
        .eq('date', selectedDate)
        .select();

      if (error) throw new Error(error.message);

      onPollUpdate();
    } catch (error) {
      console.error('Error confirming response:', error);
      alert(`Failed to confirm response: ${error.message}`);
    } finally {
      setUpdatingPoll(prev => ({ ...prev, [updateKey]: false }));
    }
  };

  const getStatusBadge = (hasResponse, confirmationStatus) => {
    if (!hasResponse) {
      return (
        <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
          No Response
        </span>
      );
    }

    const isPending = confirmationStatus === 'pending';
    return (
      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
        isPending ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
      }`}>
        {isPending ? 'Pending' : 'Confirmed'}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="bg-white rounded-lg shadow border border-gray-200 p-12 text-center">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
          <p className="text-gray-600">No data matches the current filter criteria.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Attendance</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Portion</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Confirmation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {data.map((item) => {
                const userId = item.user_id;
                const hasResponse = item.hasResponse;
                const isPresent = item.present || false;
                const portionSize = item.portion_size || 'full';
                const confirmationStatus = item.confirmation_status;
                const isPending = confirmationStatus === 'pending';
                const userData = item.user_data;

                return (
                  <tr
                    key={userId}
                    className={`hover:bg-gray-50 transition-colors duration-150 ${
                      hasResponse 
                        ? (isPending ? 'bg-yellow-50' : 'bg-green-50') 
                        : ''
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          hasResponse 
                            ? (isPending ? 'bg-yellow-100' : 'bg-green-100')
                            : 'bg-gray-100'
                        }`}>
                          {hasResponse ? (
                            <User className={`w-5 h-5 ${
                              isPending ? 'text-yellow-600' : 'text-green-600'
                            }`} />
                          ) : (
                            <UserX className="w-5 h-5 text-gray-500" />
                          )}
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">
                            {userData?.full_name || 'Unknown User'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {userData?.email || 'No email'}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {userData?.contact_number || 'No phone'}
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(hasResponse, confirmationStatus)}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleAttendanceToggle(userId, isPresent, hasResponse)}
                        disabled={updatingPoll[`${userId}_attendance`]}
                        className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                          isPresent 
                            ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                            : 'bg-red-100 text-red-800 hover:bg-red-200'
                        } ${updatingPoll[`${userId}_attendance`] ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {isPresent ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                        {updatingPoll[`${userId}_attendance`] 
                          ? 'Updating...' 
                          : isPresent ? 'Present' : 'Absent'
                        }
                      </button>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handlePortionToggle(userId, portionSize, hasResponse)}
                        disabled={updatingPoll[`${userId}_portion`]}
                        className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                          portionSize === 'full' 
                            ? 'bg-blue-100 text-blue-800 hover:bg-blue-200' 
                            : 'bg-orange-100 text-orange-800 hover:bg-orange-200'
                        } ${updatingPoll[`${userId}_portion`] ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {updatingPoll[`${userId}_portion`] 
                          ? 'Updating...' 
                          : portionSize === 'full' ? 'Full Plate' : 'Half Plate'
                        }
                      </button>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      {hasResponse && isPending ? (
                        <button
                          onClick={() => handleConfirmResponse(userId)}
                          disabled={updatingPoll[`${userId}_confirm`]}
                          className="inline-flex items-center gap-2 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {updatingPoll[`${userId}_confirm`] ? (
                            <>
                              <Clock size={16} className="animate-spin" />
                              Confirming...
                            </>
                          ) : (
                            <>
                              <Check size={16} />
                              Confirm
                            </>
                          )}
                        </button>
                      ) : hasResponse && !isPending ? (
                        <span className="inline-flex items-center gap-2 px-3 py-2 bg-green-100 text-green-800 text-sm font-medium rounded-lg">
                          <CheckCircle size={16} />
                          Confirmed
                        </span>
                      ) : (
                        <span className="text-sm text-gray-500">-</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
