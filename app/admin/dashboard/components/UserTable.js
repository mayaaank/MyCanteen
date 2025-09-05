// components/dashboard/UserTable.js
'use client'

import { Eye, Users, User, ToggleLeft, ToggleRight, Check, Clock, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

const UserTable = ({ users, onViewUser, loading, pollResponses = [], onPollUpdate }) => {
  const [updatingPoll, setUpdatingPoll] = useState({});
  const supabase = createClientComponentClient();

  const getRoleBadge = (role) => {
    const roleStyles = {
      admin: "bg-red-100 text-red-800",
      user: "bg-blue-100 text-blue-800",
      staff: "bg-green-100 text-green-800"
    };
    
    return (
      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${roleStyles[role] || 'bg-gray-100 text-gray-800'}`}>
        {role}
      </span>
    );
  };

  const getPollResponse = (userId) => {
    return pollResponses.find(response => response.user_id === userId);
  };

  const handleAttendanceToggle = async (userId, currentAttendance) => {
    setUpdatingPoll(prev => ({ ...prev, [`${userId}_attendance`]: true }));
    
    const today = new Date().toISOString().slice(0, 10);
    const newAttendance = !currentAttendance;
    
    try {
      const existingResponse = getPollResponse(userId);
      
      if (existingResponse) {
        // Update existing response
        const { error } = await supabase
          .from('poll_responses')
          .update({ present: newAttendance })
          .eq('user_id', userId)
          .eq('date', today);

        if (error) throw error;
      } else {
        // Create new response with default values
        const { error } = await supabase
          .from('poll_responses')
          .insert({
            user_id: userId,
            date: today,
            present: newAttendance,
            portion_size: 'full', // default portion
            confirmation_status: 'pending'
          });

        if (error) throw error;
      }

      // Call the parent component's update handler
      if (onPollUpdate) {
        onPollUpdate();
      }
    } catch (error) {
      console.error('Error updating attendance:', error);
    }

    setUpdatingPoll(prev => ({ ...prev, [`${userId}_attendance`]: false }));
  };

  const handlePortionToggle = async (userId, currentPortion) => {
    setUpdatingPoll(prev => ({ ...prev, [`${userId}_portion`]: true }));
    
    const today = new Date().toISOString().slice(0, 10);
    const newPortion = currentPortion === 'full' ? 'half' : 'full';
    
    try {
      const existingResponse = getPollResponse(userId);
      
      if (existingResponse) {
        // Update existing response
        const { error } = await supabase
          .from('poll_responses')
          .update({ portion_size: newPortion })
          .eq('user_id', userId)
          .eq('date', today);

        if (error) throw error;
      } else {
        // Create new response with default values
        const { error } = await supabase
          .from('poll_responses')
          .insert({
            user_id: userId,
            date: today,
            present: true, // default attendance
            portion_size: newPortion,
            confirmation_status: 'pending'
          });

        if (error) throw error;
      }

      // Call the parent component's update handler
      if (onPollUpdate) {
        onPollUpdate();
      }
    } catch (error) {
      console.error('Error updating portion:', error);
    }

    setUpdatingPoll(prev => ({ ...prev, [`${userId}_portion`]: false }));
  };

  const handleConfirmResponse = async (userId) => {
    setUpdatingPoll(prev => ({ ...prev, [`${userId}_confirm`]: true }));
    
    const today = new Date().toISOString().slice(0, 10);
    
    try {
      const { error } = await supabase
        .from('poll_responses')
        .update({ confirmation_status: 'confirmed' })
        .eq('user_id', userId)
        .eq('date', today);

      if (error) throw error;

      // Call the parent component's update handler
      if (onPollUpdate) {
        onPollUpdate();
      }
    } catch (error) {
      console.error('Error confirming response:', error);
    }

    setUpdatingPoll(prev => ({ ...prev, [`${userId}_confirm`]: false }));
  };

  if (loading) {
    return (
      <div className="px-6 py-8">
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="px-6 py-12 text-center">
        <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
        <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
      </div>
    );
  }

  // Sort users: poll responders first, then by confirmation status
  const sortedUsers = [...users].sort((a, b) => {
    const aResponse = getPollResponse(a.id);
    const bResponse = getPollResponse(b.id);
    
    const aHasResponse = !!aResponse;
    const bHasResponse = !!bResponse;
    
    // First priority: users with responses
    if (aHasResponse && !bHasResponse) return -1;
    if (!aHasResponse && bHasResponse) return 1;
    
    // Second priority: pending confirmations first
    if (aHasResponse && bHasResponse) {
      const aPending = aResponse.confirmation_status === 'pending';
      const bPending = bResponse.confirmation_status === 'pending';
      
      if (aPending && !bPending) return -1;
      if (!aPending && bPending) return 1;
    }
    
    return 0;
  });

  return (
    <div className="px-6 py-4">
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Poll Status</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Attendance</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Portion</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Confirmation</th>
                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {sortedUsers.map((user) => {
                const pollResponse = getPollResponse(user.id);
                const hasResponse = !!pollResponse;
                const isPresent = pollResponse?.present ?? false;
                const portionSize = pollResponse?.portion_size ?? 'full';
                const confirmationStatus = pollResponse?.confirmation_status ?? 'pending';
                const isPending = confirmationStatus === 'pending';

                return (
                  <tr key={user.id} className={`hover:bg-gray-50 transition-colors duration-150 ${
                    hasResponse ? (isPending ? 'bg-yellow-50' : 'bg-green-50') : ''
                  }`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          hasResponse 
                            ? (isPending ? 'bg-yellow-100' : 'bg-green-100')
                            : 'bg-blue-100'
                        }`}>
                          <User className={`w-5 h-5 ${
                            hasResponse 
                              ? (isPending ? 'text-yellow-600' : 'text-green-600')
                              : 'text-blue-600'
                          }`} />
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">{user.full_name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.contact_number}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        hasResponse 
                          ? (isPending ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800')
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {hasResponse ? (isPending ? 'Pending' : 'Confirmed') : 'No Response'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleAttendanceToggle(user.id, isPresent)}
                        disabled={updatingPoll[`${user.id}_attendance`]}
                        className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                          isPresent 
                            ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                            : 'bg-red-100 text-red-800 hover:bg-red-200'
                        } ${updatingPoll[`${user.id}_attendance`] ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {isPresent ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                        {updatingPoll[`${user.id}_attendance`] 
                          ? 'Updating...' 
                          : isPresent ? 'Present' : 'Absent'
                        }
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handlePortionToggle(user.id, portionSize)}
                        disabled={updatingPoll[`${user.id}_portion`]}
                        className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                          portionSize === 'full' 
                            ? 'bg-blue-100 text-blue-800 hover:bg-blue-200' 
                            : 'bg-orange-100 text-orange-800 hover:bg-orange-200'
                        } ${updatingPoll[`${user.id}_portion`] ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {updatingPoll[`${user.id}_portion`] 
                          ? 'Updating...' 
                          : portionSize === 'full' ? 'Full Plate' : 'Half Plate'
                        }
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {hasResponse && isPending ? (
                        <button
                          onClick={() => handleConfirmResponse(user.id)}
                          disabled={updatingPoll[`${user.id}_confirm`]}
                          className="inline-flex items-center gap-2 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {updatingPoll[`${user.id}_confirm`] ? (
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
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button
                        onClick={() => onViewUser(user)}
                        className="inline-flex items-center gap-2 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-all duration-200"
                      >
                        <Eye size={16} />
                        View
                      </button>
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
};

export default UserTable;