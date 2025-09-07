// app/admin/polls/page.js
'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

import PollHeader from './components/PollHeader';

import PollFilters from './components/PollFilters';
import PollResponseTable from './components/PollResponseTable';

export default function AdminPollsPage() {
  const router = useRouter();
  const supabase = createClientComponentClient();

  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
  const [pollResponses, setPollResponses] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all'); // all, pending, confirmed, no-response

  useEffect(() => {
    checkAuthAndInitialize();
  }, []);

  useEffect(() => {
    if (currentUser) {
      fetchPollData();
    }
  }, [selectedDate, currentUser]);

  const checkAuthAndInitialize = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      // Check if user is admin
      const { data: profile } = await supabase
        .from('profiles_new')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profile?.role !== 'admin') {
        router.push('/unauthorized');
        return;
      }

      setCurrentUser(user);
      
      // Fetch all users for reference
      const { data: users } = await supabase
        .from('profiles_new')
        .select('id, full_name, email, contact_number')
        .eq('role', 'user');
      
      setAllUsers(users || []);
    } catch (error) {
      console.error('Auth error:', error);
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  const fetchPollData = async () => {
    try {
      setLoading(true);
      
      const { data: responses, error } = await supabase
        .from('poll_responses')
        .select(`
          *,
          profiles_new!poll_responses_user_id_fkey(
            full_name,
            email,
            contact_number
          )
        `)
        .eq('date', selectedDate);

      if (error) throw error;

      setPollResponses(responses || []);
    } catch (error) {
      console.error('Error fetching poll data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePollUpdate = () => {
    fetchPollData();
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  // Calculate statistics
  const pollStats = {
    totalUsers: allUsers.length,
    totalResponses: pollResponses.length,
    pendingConfirmations: pollResponses.filter(r => r.confirmation_status === 'pending').length,
    confirmedResponses: pollResponses.filter(r => r.confirmation_status === 'confirmed').length,
    attendingUsers: pollResponses.filter(r => r.present).length,
    noResponseUsers: allUsers.length - pollResponses.length,
    fullMeals: pollResponses.filter(r => r.present && r.portion_size === 'full').length,
    halfMeals: pollResponses.filter(r => r.present && r.portion_size === 'half').length,
  };

  // Filter responses based on selected filter
  const getFilteredData = () => {
    const usersWithResponses = pollResponses.map(response => ({
      ...response,
      user_data: response.profiles_new,
      hasResponse: true
    }));

    const usersWithoutResponses = allUsers
      .filter(user => !pollResponses.some(response => response.user_id === user.id))
      .map(user => ({
        user_id: user.id,
        user_data: user,
        hasResponse: false,
        present: false,
        portion_size: 'full',
        confirmation_status: null,
        date: selectedDate
      }));

    const allUsersData = [...usersWithResponses, ...usersWithoutResponses];

    switch (filterStatus) {
      case 'pending':
        return allUsersData.filter(item => item.confirmation_status === 'pending');
      case 'confirmed':
        return allUsersData.filter(item => item.confirmation_status === 'confirmed');
      case 'no-response':
        return allUsersData.filter(item => !item.hasResponse);
      case 'attending':
        return allUsersData.filter(item => item.present);
      default:
        return allUsersData;
    }
  };

  if (loading && !currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PollHeader 
        onLogout={handleLogout}
        currentUser={currentUser}
      />
      
     
      
      <PollFilters 
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
        filterStatus={filterStatus}
        onFilterChange={setFilterStatus}
      />
      
      <PollResponseTable 
        data={getFilteredData()}
        onPollUpdate={handlePollUpdate}
        loading={loading}
        selectedDate={selectedDate}
      />
    </div>
  );
}