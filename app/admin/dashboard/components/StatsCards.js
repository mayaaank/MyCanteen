// components/dashboard/StatsCards.js
'use client'

import { Users, UserCheck, DollarSign, MessageSquare, Clock, CheckCircle, UserPlus } from 'lucide-react';

const StatsCards = ({ totalUsers, activeUsers, totalRevenue, pollStats }) => {
  const stats = [
    {
      title: 'Total Users',
      value: totalUsers,
      icon: Users,
      color: 'bg-blue-500',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Active Users',
      value: activeUsers,
      icon: UserCheck,
      color: 'bg-green-500',
      textColor: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Poll Responses',
      value: pollStats?.totalResponses || 0,
      icon: MessageSquare,
      color: 'bg-purple-500',
      textColor: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Pending Confirmations',
      value: pollStats?.pendingConfirmations || 0,
      icon: Clock,
      color: 'bg-yellow-500',
      textColor: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    // {
    //   title: 'Confirmed Responses',
    //   value: pollStats?.confirmedResponses || 0,
    //   icon: CheckCircle,
    //   color: 'bg-green-500',
    //   textColor: 'text-green-600',
    //   bgColor: 'bg-green-50'
    // },
    {
      title: 'Attending Today',
      value: pollStats?.attendingUsers || 0,
      icon: UserPlus,
      color: 'bg-indigo-500',
      textColor: 'text-indigo-600',
      bgColor: 'bg-indigo-50'
    },
    {
      title: 'Total Revenue',
      value: `₹${totalRevenue?.toLocaleString() || '0'}`,
      icon: DollarSign,
      color: 'bg-emerald-500',
      textColor: 'text-emerald-600',
      bgColor: 'bg-emerald-50'
    }
  ];

  return (
    <div className="px-6 py-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <div
              key={index}
              className={`${stat.bgColor} p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-200`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    {stat.title}
                  </p>
                  <p className={`text-2xl font-bold ${stat.textColor}`}>
                    {stat.value}
                  </p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
              </div>
              
              {/* Additional info for poll-specific stats */}
              {stat.title === 'Pending Confirmations' && pollStats?.pendingConfirmations > 0 && (
                <div className="mt-2 text-xs text-yellow-700">
                  Requires admin action
                </div>
              )}
              
              {stat.title === 'Poll Responses' && pollStats?.totalResponses > 0 && (
                <div className="mt-2 text-xs text-purple-700">
                  {Math.round((pollStats.totalResponses / totalUsers) * 100)}% response rate
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StatsCards;