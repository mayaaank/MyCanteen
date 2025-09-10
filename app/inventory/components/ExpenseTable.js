import React, { useState, useEffect } from 'react';
import { DollarSign, Calendar, Tag, Edit, Trash2, Filter, TrendingUp, AlertCircle } from 'lucide-react';

const ExpenseTable = ({ expenses, onEdit, onDelete, filter, refresh }) => {
  const [filteredExpenses, setFilteredExpenses] = useState([]);

  // Debug logging - remove this after fixing
  console.log("Expenses received:", expenses);
  console.log("Expenses type:", typeof expenses);
  console.log("Is array:", Array.isArray(expenses));

  useEffect(() => {
    // Safety check and data conversion
    let expenseList = [];
    
    if (Array.isArray(expenses)) {
      expenseList = expenses;
    } else if (typeof expenses === 'object' && expenses && expenses.data && Array.isArray(expenses.data)) {
      expenseList = expenses.data;
    } else if (typeof expenses === 'object' && expenses && expenses.expenses && Array.isArray(expenses.expenses)) {
      expenseList = expenses.expenses;
    } else if (typeof expenses === 'object' && expenses && expenses.items && Array.isArray(expenses.items)) {
      expenseList = expenses.items;
    } else if (!expenses) {
      expenseList = [];
    } else {
      console.error("Invalid expenses format:", expenses);
      expenseList = [];
    }

    // Apply filtering
    let filtered = expenseList;
    if (filter && filter !== 'all') {
      filtered = expenseList.filter(expense => {
        const category = expense.category || expense.type || '';
        return category.toLowerCase().includes(filter.toLowerCase());
      });
    }

    setFilteredExpenses(filtered);
  }, [expenses, filter, refresh]);

  // Safety check for expenses data
  if (!expenses) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-center py-8">
          <DollarSign className="h-12 w-12 text-gray-400 mr-4" />
          <div>
            <p className="text-gray-500 text-lg">Loading expenses...</p>
          </div>
        </div>
      </div>
    );
  }

  // Handle invalid data format
  if (!Array.isArray(expenses) && 
      (!expenses.data || !Array.isArray(expenses.data)) &&
      (!expenses.expenses || !Array.isArray(expenses.expenses)) &&
      (!expenses.items || !Array.isArray(expenses.items))) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-center py-8">
          <AlertCircle className="h-12 w-12 text-red-400 mr-4" />
          <div>
            <p className="text-red-500 text-lg">Invalid data format</p>
            <p className="text-gray-500 text-sm">Expected array but received: {typeof expenses}</p>
          </div>
        </div>
      </div>
    );
  }

  // Calculate total amount safely
  const totalAmount = filteredExpenses.reduce((sum, expense) => {
    const amount = parseFloat(expense.amount || expense.cost || expense.price || 0);
    return sum + amount;
  }, 0);

  // Get expense categories for filter dropdown
  const categories = [...new Set(filteredExpenses.map(expense => 
    expense.category || expense.type || 'Uncategorized'
  ))];

  // Format date safely
  const formatDate = (dateString) => {
    if (!dateString) return 'No date';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return 'Invalid date';
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    const numAmount = parseFloat(amount || 0);
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(numAmount);
  };

  // If no expenses after filtering
  if (filteredExpenses.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Expense Records</h3>
            <p className="text-sm text-gray-500">Track and manage your business expenses</p>
          </div>
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-gray-400" />
            <span className="text-sm font-medium text-gray-500">
              Total: {formatCurrency(totalAmount)}
            </span>
          </div>
        </div>
        
        <div className="flex items-center justify-center py-8">
          <DollarSign className="h-12 w-12 text-gray-400 mr-4" />
          <div>
            <p className="text-gray-500 text-lg">
              {filter && filter !== 'all' ? 'No expenses found for this filter' : 'No expenses recorded yet'}
            </p>
            <p className="text-gray-400 text-sm">
              {filter && filter !== 'all' ? 'Try adjusting your filter criteria' : 'Add some expenses to get started'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Expense Records</h3>
            <p className="text-sm text-gray-500">Track and manage your business expenses</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              <span className="text-lg font-semibold text-gray-900">
                {formatCurrency(totalAmount)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      {categories.length > 1 && (
        <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-600">Categories:</span>
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <span
                  key={category}
                  className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full"
                >
                  {category}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredExpenses.map((expense) => {
              // Safely access expense properties with defaults
              const expenseId = expense.id || expense._id || Math.random();
              const description = expense.description || expense.name || expense.title || 'No description';
              const category = expense.category || expense.type || 'Uncategorized';
              const amount = expense.amount || expense.cost || expense.price || 0;
              const date = expense.date || expense.created_at || expense.createdAt || new Date().toISOString();
              const notes = expense.notes || expense.comment || '';

              return (
                <tr key={expenseId} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-start">
                      <DollarSign className="h-5 w-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {description}
                        </div>
                        {notes && (
                          <div className="text-sm text-gray-500 mt-1">
                            {notes}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      <Tag className="w-3 h-3 mr-1" />
                      {category}
                    </span>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900">
                      {formatCurrency(amount)}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="w-4 h-4 mr-1" />
                      {formatDate(date)}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      {onEdit && (
                        <button
                          onClick={() => onEdit(expense)}
                          className="text-indigo-600 hover:text-indigo-900 p-1 rounded hover:bg-indigo-50"
                          title="Edit expense"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => onDelete(expense)}
                          className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                          title="Delete expense"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div>
            Total expenses: {filteredExpenses.length}
          </div>
          <div className="font-medium">
            Grand Total: {formatCurrency(totalAmount)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseTable;