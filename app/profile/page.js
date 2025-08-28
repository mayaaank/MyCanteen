'use client';

import { useState } from 'react';
import InvoiceDownloadSection from '@/components/InvoiceDownloadSection';

export default function ProfilePage() {
  return (
    <div className="pt-20 pb-24 px-6 text-center">
      <h1 className="text-3xl font-bold text-blue-600 mb-4">Your Profile</h1>
      <p className="text-gray-700 mb-6">Check your details and meal history.</p>

      <div className="max-w-md mx-auto p-4 border rounded shadow mb-6">
        <h2 className="text-xl font-semibold mb-2">👋 Hi, Kanak!</h2>
        <p><strong>Student ID:</strong> 2025CSE001</p>
        <p><strong>Meals Availed:</strong> 14 this month</p>
        <p><strong>Favorite Dish:</strong> Paneer Butter Masala</p>
      </div>

      {/* Invoice Generation Section */}
      <InvoiceDownloadSection userId="2025CSE001" userName="Kanak" />
    </div>
  );
}