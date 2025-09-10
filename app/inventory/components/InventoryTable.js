// components/inventory/InventoryTable.js
import React from 'react';
import { Package, AlertTriangle, CheckCircle, XCircle, Edit, Trash2 } from 'lucide-react';

const InventoryTable = ({ items, onEdit, onDelete }) => {
  // Debug logging - remove this after fixing
  console.log("Items received:", items);
  console.log("Items type:", typeof items);
  console.log("Is array:", Array.isArray(items));

  // Safety check for items
  if (!items) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-center py-8">
          <Package className="h-12 w-12 text-gray-400 mr-4" />
          <div>
            <p className="text-gray-500 text-lg">Loading inventory items...</p>
          </div>
        </div>
      </div>
    );
  }

  // Convert to array if it's not already an array
  let inventoryItems = [];
  if (Array.isArray(items)) {
    inventoryItems = items;
  } else if (typeof items === 'object' && items.data && Array.isArray(items.data)) {
    // Handle case where API returns {data: [...]}
    inventoryItems = items.data;
  } else if (typeof items === 'object' && items.items && Array.isArray(items.items)) {
    // Handle case where API returns {items: [...]}
    inventoryItems = items.items;
  } else {
    // If items is neither array nor object with array property
    console.error("Invalid items format:", items);
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-center py-8">
          <XCircle className="h-12 w-12 text-red-400 mr-4" />
          <div>
            <p className="text-red-500 text-lg">Invalid data format</p>
            <p className="text-gray-500 text-sm">Expected array but received: {typeof items}</p>
          </div>
        </div>
      </div>
    );
  }

  // If empty array
  if (inventoryItems.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-center py-8">
          <Package className="h-12 w-12 text-gray-400 mr-4" />
          <div>
            <p className="text-gray-500 text-lg">No inventory items found</p>
            <p className="text-gray-400 text-sm">Add some items to get started</p>
          </div>
        </div>
      </div>
    );
  }

  // Function to determine stock status
  const getStockStatus = (currentStock, minStock = 10) => {
    if (currentStock === 0) {
      return { status: 'out-of-stock', color: 'text-red-600', bg: 'bg-red-100', icon: XCircle };
    } else if (currentStock <= minStock) {
      return { status: 'low-stock', color: 'text-yellow-600', bg: 'bg-yellow-100', icon: AlertTriangle };
    } else {
      return { status: 'in-stock', color: 'text-green-600', bg: 'bg-green-100', icon: CheckCircle };
    }
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Inventory Items</h3>
        <p className="text-sm text-gray-500">Manage your inventory items and stock levels</p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Item Details
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stock Level
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Unit Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Value
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {inventoryItems.map((item) => {
              // Safely access item properties with defaults
              const itemId = item.id || item._id || Math.random();
              const itemName = item.name || item.item_name || 'Unknown Item';
              const itemDescription = item.description || '';
              const currentStock = item.current_stock || item.stock || item.quantity || 0;
              const minStock = item.min_stock || item.minimum_stock || 10;
              const unitPrice = item.unit_price || item.price || 0;
              const category = item.category || 'Uncategorized';
              
              const stockStatus = getStockStatus(currentStock, minStock);
              const StatusIcon = stockStatus.icon;
              const totalValue = currentStock * unitPrice;

              return (
                <tr key={itemId} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Package className="h-10 w-10 text-gray-400 mr-3" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {itemName}
                        </div>
                        {itemDescription && (
                          <div className="text-sm text-gray-500">
                            {itemDescription}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                      {category}
                    </span>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <span className="font-medium">{currentStock}</span> units
                    </div>
                    <div className="text-xs text-gray-500">
                      Min: {minStock}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${unitPrice.toFixed(2)}
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span className="font-medium">${totalValue.toFixed(2)}</span>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${stockStatus.bg} ${stockStatus.color}`}>
                      <StatusIcon className="w-4 h-4 mr-1" />
                      {stockStatus.status.replace('-', ' ')}
                    </span>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      {onEdit && (
                        <button
                          onClick={() => onEdit(item)}
                          className="text-indigo-600 hover:text-indigo-900 p-1 rounded hover:bg-indigo-50"
                          title="Edit item"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => onDelete(item)}
                          className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                          title="Delete item"
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
      
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
        <div className="text-sm text-gray-500">
          Total items: {inventoryItems.length}
        </div>
      </div>
    </div>
  );
};

export default InventoryTable;