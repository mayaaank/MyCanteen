// app/admin/inventory/page.js
'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Package, DollarSign, TrendingUp, ShoppingCart, ArrowLeft } from 'lucide-react';

// ✅ Alternative using relative paths
import ExpenseForm from '../../inventory/components/ExpenseForm';
import ExpenseTable from '../../inventory/components/ExpenseTable';
import InventoryItemForm from '../../inventory/components/InventoryItemForm';
import InventoryTable from '../../inventory/components/InventoryTable';
import StockUpdateModal from '../../inventory/components/StockUpdateModal';

export default function InventoryManagementPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedItem, setSelectedItem] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleStockUpdate = (item) => {
    setSelectedItem(item);
  };

  const handleCloseModal = () => {
    setSelectedItem(null);
  };

  const handleStockUpdated = () => {
    handleRefresh();
    handleCloseModal();
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Package },
    { id: 'expenses', label: 'Expenses', icon: DollarSign },
    { id: 'inventory', label: 'Inventory', icon: Package },
    { id: 'sales', label: 'Sales', icon: ShoppingCart },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/admin/dashboard')}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft size={20} />
                Back to Dashboard
              </button>
              <div className="border-l border-gray-300 pl-4">
                <h1 className="text-2xl font-bold text-gray-900">Inventory & Expense Management</h1>
                <p className="text-sm text-gray-600">Manage inventory, track expenses, and record sales</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Package className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Items</p>
                    <p className="text-2xl font-semibold text-gray-900">--</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <DollarSign className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Monthly Expenses</p>
                    <p className="text-2xl font-semibold text-gray-900">₹--</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
                    <p className="text-2xl font-semibold text-gray-900">₹--</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <ShoppingCart className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Low Stock Items</p>
                    <p className="text-2xl font-semibold text-gray-900">--</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Overview Tables */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <ExpenseTable refresh={refreshTrigger} />
              <InventoryTable 
                refresh={refreshTrigger} 
                onStockUpdate={handleStockUpdate}
              />
            </div>
          </div>
        )}

        {activeTab === 'expenses' && (
          <div className="space-y-8">
            <ExpenseForm onAdded={handleRefresh} />
            <ExpenseTable refresh={refreshTrigger} />
          </div>
        )}

        {activeTab === 'inventory' && (
          <div className="space-y-8">
            <InventoryItemForm onAdded={handleRefresh} />
            <InventoryTable 
              refresh={refreshTrigger} 
              onStockUpdate={handleStockUpdate}
            />
          </div>
        )}

        {activeTab === 'sales' && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">Sales Management</h3>
            <p className="text-gray-600">Sales recording functionality will be added here. For now, you can update stock through the Inventory tab.</p>
          </div>
        )}
      </div>

      {/* Stock Update Modal */}
      {selectedItem && (
        <StockUpdateModal
          item={selectedItem}
          onClose={handleCloseModal}
          onUpdated={handleStockUpdated}
        />
      )}
    </div>
  );
}