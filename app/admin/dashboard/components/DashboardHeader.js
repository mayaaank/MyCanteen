// components/dashboard/DashboardHeader.js - Updated with Polls navigation
import { Plus, Users, BarChart3 } from 'lucide-react';

export default function DashboardHeader({ onCreateUser, onManagePolls, onLogout, currentUser }) {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-sm text-gray-600">Manage users and system settings</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={onManagePolls}
              className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
            >
              <BarChart3 size={16} />
              Manage Polls
            </button>
            
            <button
              onClick={onCreateUser}
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              <Plus size={16} />
              Create User
            </button>
            
            <button
              onClick={onLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}