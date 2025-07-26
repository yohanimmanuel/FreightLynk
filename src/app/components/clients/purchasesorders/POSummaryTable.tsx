import React from 'react';
import { Trash2 } from 'lucide-react';
import { PurchaseOrder, PODetail } from '@/store/poStore';

interface POSummaryTableProps {
  selectedPOs: {
    poId: string;
    selectedItems: number[] | Set<number> | any;
    bookedQuantities: Record<number, number> | any;
  }[];
  purchaseOrdersData: PurchaseOrder[];
  poDetailsData: PODetail[];
  onRemovePO?: (poId: string) => void;
}

const POSummaryTable: React.FC<POSummaryTableProps> = ({ selectedPOs, purchaseOrdersData, poDetailsData, onRemovePO }) => {
  console.log('POSummaryTable selectedPOs:', selectedPOs);
  console.log('POSummaryTable purchaseOrdersData:', purchaseOrdersData);
  console.log('POSummaryTable poDetailsData:', poDetailsData);
  console.log('POSummaryTable render - selectedPOs length:', selectedPOs.length, 'purchaseOrders length:', purchaseOrdersData.length, 'poDetails length:', poDetailsData.length);
  
  // Normalize selectedPOs to handle different data formats
  const normalizedSelectedPOs = selectedPOs.map(poSelection => {
    // Ensure selectedItems is an array
    let selectedItems = [];
    if (Array.isArray(poSelection.selectedItems)) {
      selectedItems = poSelection.selectedItems;
    } else if (poSelection.selectedItems instanceof Set) {
      selectedItems = Array.from(poSelection.selectedItems);
    } else if (typeof poSelection.selectedItems === 'object' && poSelection.selectedItems !== null) {
      // Handle any other object type
      try {
        selectedItems = Object.values(poSelection.selectedItems);
      } catch (e) {
        selectedItems = [];
      }
    }
    
    // Ensure bookedQuantities is a record
    const bookedQuantities = poSelection.bookedQuantities || {};
    
    return {
      ...poSelection,
      selectedItems,
      bookedQuantities
    };
  });
  
  // Build summary data
  const selectedData = normalizedSelectedPOs.map(poSelection => {
    console.log('Processing PO selection:', poSelection);
    const po = purchaseOrdersData.find(p => p.id === poSelection.poId);
    if (!po) {
      console.log('PO not found for ID:', poSelection.poId);
      return null;
    }
    
    // Use the same format as POManagementTable - use poId directly
    const poNum = poSelection.poId;
    console.log('Looking for PO details with poOrderNumber:', poNum);
    console.log('Available poDetails poOrderNumbers:', poDetailsData.map(item => item.poOrderNumber));
    
    const filteredItems = poDetailsData.filter(item =>
      poSelection.selectedItems.includes(item.id) &&
      item.poOrderNumber === poNum
    );
    console.log('Filtered items for PO', poNum, ':', filteredItems);
    
    const items = filteredItems.map(item => ({
      ...item,
      poOrderNumber: poNum,
      booked: poSelection.bookedQuantities[item.id] || 0
    }));
    console.log('Items with booked quantities:', items);
    
    const itemsWithBooking = items.filter(item => item.booked > 0);
    console.log('Items with booked > 0:', itemsWithBooking);
    
    return { po, items: itemsWithBooking, selection: poSelection };
  }).filter((data): data is NonNullable<typeof data> => data !== null && data.items.length > 0);

  const poDetailsForSummary = selectedData.flatMap(({ items, po }) =>
    items.map(item => ({
      ...item,
      poOrderNumber: po.id, // Use the original PO ID directly
      booked: Number(item.booked) || 0
    }))
  );

  const purchaseOrdersForSummary = Array.from(
    new Set(
      poDetailsForSummary
        .map(item => purchaseOrdersData.find(po => po.id === item.poOrderNumber))
        .filter((po): po is PurchaseOrder => Boolean(po))
    )
  );

  const groupedPOs: Record<string, (typeof poDetailsForSummary)> = poDetailsForSummary.reduce((acc, item) => {
    const poKey = item.poOrderNumber; // Use the PO ID directly
    if (!acc[poKey]) acc[poKey] = [];
    acc[poKey].push(item);
    return acc;
  }, {} as Record<string, typeof poDetailsForSummary>);

  if (poDetailsForSummary.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        No booked purchase orders found
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {purchaseOrdersForSummary.map((po) => (
        <div key={po.id} className="bg-white rounded-lg border border-gray-200">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="text-sm font-medium text-blue-600">{po.id}</div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-xs px-2 py-1 rounded ${
                po.status === 'Open' 
                  ? 'bg-green-100 text-green-800' 
                  : po.status === 'Closed' 
                    ? 'bg-gray-100 text-gray-800' 
                    : 'bg-yellow-100 text-yellow-800'
              }`}>
                {po.status}
              </span>
              {onRemovePO && (
                <button
                  onClick={() => onRemovePO(po.id)}
                  className="p-1 text-gray-400 hover:text-red-600 rounded-full focus:outline-none"
                  title="Remove PO"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
          
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Currency</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Cost</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Requested</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booked</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Completion</th>
                </tr>
              </thead>
            <tbody>
                {groupedPOs[po.id]?.map((item, index) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 text-xs text-gray-900">{index + 1}</td>
                    <td className="px-4 py-4">
                      <div className="text-xs font-medium text-gray-900">{item.productCode}</div>
                      <div className="text-xs text-gray-500">{item.productName}</div>
                    </td>
                    <td className="px-4 py-4 text-xs text-gray-900">{item.currency}</td>
                    <td className="px-4 py-4 text-xs text-gray-900">{item.unitCost}</td>
                    <td className="px-4 py-4 text-xs text-gray-900">{item.requested}</td>
                    <td className="px-4 py-4 text-xs text-gray-900">{item.booked}</td>
                    <td className="px-4 py-4 text-xs text-gray-900">
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div 
                          className="bg-blue-600 h-1.5 rounded-full" 
                          style={{ width: `${(item.booked / item.requested) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-500 mt-1">
                        {Math.round((item.booked / item.requested) * 100)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
        </div>
      ))}
    </div>
  );
};

export default POSummaryTable; 