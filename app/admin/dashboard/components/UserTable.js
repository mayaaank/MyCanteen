// components/dashboard/UserTable.js - Cleaned version without poll functionality
'use client'

import { Eye, Users, User, Mail, Phone, Calendar } from 'lucide-react';

const UserTable = ({ users, onViewUser, loading }) => {
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

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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
        <p className="text-gray-600">Try adjusting your search criteria or create a new user.</p>
      </div>
    );
  }

  // Sort users: admins first, then by creation date
  const sortedUsers = [...users].sort((a, b) => {
    if (a.role === 'admin' && b.role !== 'admin') return -1;
    if (a.role !== 'admin' && b.role === 'admin') return 1;
    return new Date(b.created_at) - new Date(a.created_at);
  });

  return (
    <div className="px-6 py-4">
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-900">User Management</h3>
          <p className="text-sm text-gray-600 mt-1">
            Manage user accounts and permissions
          </p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bill Status
                </th>
                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {sortedUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        user.role === 'admin' ? 'bg-red-100' : 'bg-blue-100'
                      }`}>
                        <User className={`w-5 h-5 ${
                          user.role === 'admin' ? 'text-red-600' : 'text-blue-600'
                        }`} />
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">
                          {user.full_name || 'N/A'}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center gap-1">
                          <Mail size={12} />
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getRoleBadge(user.role)}
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 flex items-center gap-1">
                      <Phone size={12} />
                      {user.contact_number || 'Not provided'}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 flex items-center gap-1">
                      <Calendar size={12} />
                      {formatDate(user.created_at)}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm">
                      <span className="text-gray-900 font-medium">
                        ₹{user.total_bill || 0}
                      </span>
                      <span className="text-gray-500 ml-1 text-xs">total</span>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button
                      onClick={() => onViewUser(user)}
                      className="inline-flex items-center gap-2 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-all duration-200"
                    >
                      <Eye size={16} />
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>
              Showing {users.length} user{users.length !== 1 ? 's' : ''}
            </span>
            <span>
              {users.filter(u => u.role === 'admin').length} admin{users.filter(u => u.role === 'admin').length !== 1 ? 's' : ''} • {' '}
              {users.filter(u => u.role === 'user').length} regular user{users.filter(u => u.role === 'user').length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserTable;