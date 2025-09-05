// app/admin/dashboard/page.js
'use client'


import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';


import DashboardHeader from './components/DashboardHeader';
import StatsCards from './components/StatsCards';
import SearchBar from './components/SearchAndFilter';
import UserTable from './components/UserTable';
import UserDetailModal from './components/UserDetailModal';


export default function AdminDashboard() {
 const router = useRouter();
 const supabase = createClientComponentClient();


 const [users, setUsers] = useState([]);
 const [pollResponses, setPollResponses] = useState([]);
 const [currentUser, setCurrentUser] = useState(null);
 const [loading, setLoading] = useState(true);
 const [selectedUser, setSelectedUser] = useState(null);
 const [searchTerm, setSearchTerm] = useState('');
 const [totalRevenue, setTotalRevenue] = useState(50000); // dummy data for now


 async function fetchData() {
   const { data, error } = await supabase
     .from('transactions')
     .select('amount');


   if (!error && data) {
     const revenue = data.reduce((sum, row) => sum + row.amount, 0);
     setTotalRevenue(revenue);
   }
 }


 const fetchPollResponses = async () => {
   const today = new Date().toISOString().slice(0, 10);
   const { data: pollData, error: pollError } = await supabase
     .from('poll_responses')
     .select('*')
     .eq('date', today);


   if (!pollError) {
     setPollResponses(pollData || []);
   }
 };


 // Auth + Initial load
 useEffect(() => {
   const fetchInitial = async () => {
     const { data: { user } } = await supabase.auth.getUser();
     if (!user) {
       router.push('/login');
       return;
     }
     setCurrentUser(user);


     const { data, error } = await supabase.from('profiles_new').select('*');
     if (error) console.error(error.message);
     else setUsers(data);


     // Fetch today's poll responses
     await fetchPollResponses();


     setLoading(false);
   };


   fetchInitial();
   fetchData(); // Fetch revenue data
 }, [router, supabase]);


 // 🔍 Search query against Supabase
 useEffect(() => {
   const fetchUsers = async () => {
     setLoading(true);


     let query = supabase.from('profiles_new').select('*');


     if (searchTerm.trim()) {
       query = query.or(
         `full_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`
       );
     }


     const { data, error } = await query;
     if (error) {
       console.error('Search error:', error.message);
     } else {
       setUsers(data || []);
     }


     setLoading(false);
   };


   if (searchTerm.trim() !== '') {
     fetchUsers();
   } else {
     // If no search term, fetch all users
     //fetchAllUsers();
     setLoading(false);
   }
 }, [searchTerm, supabase]);


 const handlePollUpdate = () => {
   // Refetch poll responses when admin makes changes
   fetchPollResponses();
 };


 const handleLogout = async () => {
   await supabase.auth.signOut();
   router.push('/login');
 };


 const handleCreateUser = () => {
   router.push('/admin/create-user');
 };


 // Calculate poll stats
 const pollStats = {
   totalResponses: pollResponses.length,
   pendingConfirmations: pollResponses.filter(r => r.confirmation_status === 'pending').length,
   confirmedResponses: pollResponses.filter(r => r.confirmation_status === 'confirmed').length,
   attendingUsers: pollResponses.filter(r => r.present).length,
 };


 return (
   <div className="min-h-screen bg-gray-50">
     <DashboardHeader
       onCreateUser={handleCreateUser}
       onLogout={handleLogout}
       currentUser={currentUser}
     />
    
     <StatsCards
       totalUsers={users.length}
       activeUsers={users.filter(u => u.role === 'user').length}
       totalRevenue={totalRevenue}
       pollStats={pollStats}
     />


     <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
    
     <UserTable
       users={users}
       pollResponses={pollResponses}
       onViewUser={(user) => setSelectedUser(user)}
       onPollUpdate={handlePollUpdate}
       loading={loading}
     />
    
     <UserDetailModal
       user={selectedUser}
       onClose={() => setSelectedUser(null)}
     />
   </div>
 );
}

