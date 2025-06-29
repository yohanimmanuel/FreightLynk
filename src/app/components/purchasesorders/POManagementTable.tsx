import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown, ChevronRight, ChevronLeft, Search, Upload, Download, Plus, Filter, MoreHorizontal, Check, X, Edit } from 'lucide-react';

export interface PurchaseOrder {
  id: string;
  exceptions: string;
  cargoReadyBy: string;
  mustArriveBy: string;
  buyer: string;
  seller: string;
  subjectedCarrier: string;
  progress: string;
  status: string;
}

export interface PODetail {
  id: number;
  poOrderNumber: number;
  productCode: string;
  productName: string;
  cargoReadyDate: string;
  mustArriveDate: string;
  transportMode: string;
  destination: string;
  currency: string;
  unitCost: string;
  uom: string;
  requested: number;
}

interface POSelection {
  poId: string;
  selectedItems: Set<number>; // Only explicitly checked items
  bookedQuantities: Record<number, number>; // All quantities (selected or not)
}

export interface POManagementTableProps {
  onEditOrder: (poId: string) => void;
  onCreateBooking?: (bookingData: {
    poId: string;
    selectedItems: number[];
    bookedQuantities: Record<number, number>;
  }[]) => void;  // Add this
  purchaseOrders?: PurchaseOrder[];
  poDetails?: PODetail[];
  mode?: 'standalone' | 'review';
}

export const purchaseOrdersData: PurchaseOrder[] = [
    {
      id: 'PO3400',
      exceptions: 'Missed cargo ready date',
      cargoReadyBy: 'Aug 30, 2019',
      mustArriveBy: 'Oct 1, 2019',
      buyer: 'Studio Apparel',
      seller: 'Forward Supply Co',
      subjectedCarrier: 'Maersk Line',
      progress: '1/2 lines booked',
      status: 'Open'
    },
    {
      id: 'PO1000',
      exceptions: 'Missed cargo ready date',
      cargoReadyBy: 'Jan 28, 2021',
      mustArriveBy: 'Feb 12, 2021',
      buyer: 'Studio Apparel',
      seller: 'Forward Supply Co',
      subjectedCarrier: 'DHL Express',
      progress: '0/7 lines booked',
      status: 'Open'
    },
    {
      id: 'PO1057',
      exceptions: 'Missed cargo ready date',
      cargoReadyBy: 'Feb 21, 2021',
      mustArriveBy: 'Apr 15, 2021',
      buyer: 'Studio Apparel',
      seller: 'Forward Supply Co',
      subjectedCarrier: 'COSCO Shipping',
      progress: '0/7 lines booked',
      status: 'Open'
    },
    {
      id: 'PO1055',
      exceptions: '--',
      cargoReadyBy: 'Mar 12, 2021',
      mustArriveBy: 'Apr 15, 2021',
      buyer: 'Studio Apparel',
      seller: 'Forward Supply Co',
      subjectedCarrier: 'FedEx',
      progress: '1/7 lines booked',
      status: 'Open'
    },
    {
      id: 'PO1003',
      exceptions: 'Booking approval required',
      cargoReadyBy: 'Mar 12, 2021',
      mustArriveBy: 'Apr 15, 2021',
      buyer: 'Studio Apparel',
      seller: 'Forward Supply Co',
      subjectedCarrier: 'DB Schenker',
      progress: '1/7 lines booked',
      status: 'Open'
    },
    {
      id: 'PO2883',
      exceptions: 'Booking approval required',
      cargoReadyBy: 'Mar 12, 2021',
      mustArriveBy: 'Apr 15, 2021',
      buyer: 'Studio Apparel',
      seller: 'Forward Supply Co',
      subjectedCarrier: 'DB Schenker',
      progress: '1/7 lines booked',
      status: 'Open'
    }
];

export const poDetailsData: PODetail[] = [
    {
      id: 1,
      poOrderNumber: 3400,
      productCode: 'F-ACS-LTH-BELT-BLCK',
      productName: "Women's Leather Belt",
      cargoReadyDate: 'Aug 30, 2019',
      mustArriveDate: 'Oct 1, 2019',
      transportMode: 'Sea',
      destination: 'Los Angeles Warehouse',
      currency: 'USD',
      unitCost: '$15.00',
      uom: 'PC',
      requested: 200
    },
    {
      id: 2,
      poOrderNumber: 1000,
      productCode: 'F-BTDN-TOP-SILK',
      productName: "Women's Silk Shirt",
      cargoReadyDate: 'Jan 28, 2021',
      mustArriveDate: 'Feb 12, 2021',
      transportMode: 'Sea',
      destination: 'Los Angeles Warehouse',
      currency: 'USD',
      unitCost: '$20.00',
      uom: 'PC',
      requested: 300
    },
    {
      id: 3,
      poOrderNumber: 1057,
      productCode: 'F-BTM-DNM-BOYF-LTBLUE',
      productName: "Women's Boyfriend Jean - Lt Blue",
      cargoReadyDate: 'Feb 21, 2021',
      mustArriveDate: 'Apr 15, 2021',
      transportMode: 'Sea',
      destination: 'Los Angeles Warehouse',
      currency: 'AUD',
      unitCost: '$16.00',
      uom: 'PC',
      requested: 250
    },
    {
      id: 4,
      poOrderNumber: 1055,
      productCode: 'F-DRS-CTTN-MUSC-BLK',
      productName: "Women's Muscle Tank Dress",
      cargoReadyDate: 'Mar 12, 2021',
      mustArriveDate: 'Apr 15, 2021',
      transportMode: 'Sea',
      destination: 'Los Angeles Warehouse',
      currency: 'SGD',
      unitCost: '$12.00',
      uom: 'PC',
      requested: 400
    },
    {
      id: 5,
      poOrderNumber: 1003,
      productCode: 'F-SWTR-CSHM-KNIT',
      productName: "Women's Cashmere Knit Sweater",
      cargoReadyDate: 'Mar 12, 2021',
      mustArriveDate: 'Apr 15, 2021',
      transportMode: 'Sea',
      destination: 'Los Angeles Warehouse',
      currency: 'SGD',
      unitCost: '$25.00',
      uom: 'PC',
      requested: 150
    },
    {
      id: 6,
      poOrderNumber: 3400,
      productCode: 'F-TEE-CTTN-CREW',
      productName: "Women's Cotton Crew Tee",
      cargoReadyDate: 'Aug 30, 2019',
      mustArriveDate: 'Oct 1, 2019',
      transportMode: 'Sea',
      destination: 'Los Angeles Warehouse',
      currency: 'IDR',
      unitCost: '$12.00',
      uom: 'PC',
      requested: 170
    },
    {
      id: 7,
      poOrderNumber: 2883,
      productCode: 'F-TEE-CTTN-CREW',
      productName: "Women's Cotton Crew Tee",
      cargoReadyDate: 'Mar 12, 2021',
      mustArriveDate: 'Apr 15, 2021',
      transportMode: 'Sea',
      destination: 'Los Angeles Warehouse',
      currency: 'IDR',
      unitCost: '$12.00',
      uom: 'PC',
      requested: 170
    }
];

const POManagement = ({ onEditOrder, onCreateBooking, mode = 'review' }: POManagementTableProps) => {
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(purchaseOrdersData);
  const [poDetails] = useState<PODetail[]>(poDetailsData);
  const [selectedPOs, setSelectedPOs] = useState<POSelection[]>([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [activeBulkPOs, setActiveBulkPOs] = useState<string[]>([]);
  const [statusDropdowns, setStatusDropdowns] = useState<{[key: string]: boolean}>({});
  const statusDropdownRefs = useRef<{[key: string]: HTMLDivElement | null}>({});
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingType, setBookingType] = useState<'new' | 'existing'>('new');

    // Helper function to format date
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  useEffect(() => {
    // Update active POs and bulk actions based on selections
    const activePOs = selectedPOs
      .filter(po => po.selectedItems.size > 0)
      .map(po => po.poId);
    
    setActiveBulkPOs(activePOs);
    setShowBulkActions(activePOs.length > 0);
  }, [selectedPOs]);

  const renderBookingModal = () => {
    if (!showBookingModal) return null;

    const selectedBookingData = selectedPOs.map(poSelection => {
      const po = purchaseOrders.find(p => p.id === poSelection.poId);
      const items = poDetails.filter(item => 
        poSelection.selectedItems.has(item.id) && 
        item.poOrderNumber === parseInt(poSelection.poId.replace('PO', ''))
      );
      return { po, items, selection: poSelection };
    }).filter(data => data.po && data.items.length > 0);

    // Auto-close modal when no data
    if (selectedBookingData.length === 0) {
      setShowBookingModal(false);
      return null;
    }

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Review Booking Items</h2>
            <button
              onClick={() => setShowBookingModal(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
            {selectedBookingData.map(({ po, items, selection }) => (
              <div key={po!.id} className="border-b border-gray-200">
                <div className="bg-gray-50 px-4 py-3 flex items-center justify-between">
                  <span className="text-sm font-medium text-[#007bff]">{po!.id}</span>
                  <button
                    onClick={() => clearSelectionsForPO(po!.id)}
                    className="text-xs text-[#007bff] hover:text-blue-700"
                  >
                    Remove All
                  </button>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">#</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Product</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">CRD</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Requested</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Booked</th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {items.map((item, index) => (
                        <tr key={item.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-xs text-gray-900">{index + 1}</td>
                          <td className="px-4 py-3">
                            <div className="text-xs font-medium text-gray-900">{item.productCode}</div>
                            <div className="text-xs text-gray-500">{item.productName}</div>
                          </td>
                          <td className="px-4 py-3 text-xs text-gray-600">{formatDate(item.cargoReadyDate)}</td>
                          <td className="px-4 py-3 text-xs text-gray-900">{item.requested}</td>
                          <td className="px-4 py-3">
                            <div className="text-xs text-gray-900">
                              {selection.bookedQuantities[item.id] || 0}
                            </div>
                            <div className="text-xs text-gray-500">
                              ({Math.round(((selection.bookedQuantities[item.id] || 0) / item.requested) * 100)}%)
                            </div>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => {
                                  const currentQuantity = selection.bookedQuantities[item.id] || 0;
                                  const newQuantity = currentQuantity > 0 ? currentQuantity - 1 : 0;
                                  handleQuantityChange(po!.id, item.id, newQuantity);
                                }}
                                className="w-6 h-6 text-xs text-gray-500 bg-white hover:bg-gray-200 rounded border border-gray-200"
                              >
                                -
                              </button>
                              <input
                                type="number"
                                min="0"
                                max={item.requested}
                                value={selection.bookedQuantities[item.id] || 0}
                                onChange={(e) => {
                                  const value = Math.max(0, Math.min(Number(e.target.value) || 0, item.requested));
                                  handleQuantityChange(po!.id, item.id, value);
                                }}
                                className="w-16 p-1 text-xs text-gray-900 text-center border border-gray-200 rounded"
                              />
                              <button
                                onClick={() => {
                                  const currentQuantity = selection.bookedQuantities[item.id] || 0;
                                  const newQuantity = currentQuantity < item.requested ? currentQuantity + 1 : item.requested;
                                  handleQuantityChange(po!.id, item.id, newQuantity);
                                }}
                                className="w-6 h-6 text-xs text-gray-500 bg-white hover:bg-gray-200 rounded border border-gray-200"
                              >
                                +
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="bookingType"
                    checked={bookingType === 'new'}
                    onChange={() => setBookingType('new')}
                    className="text-[#007bff]"
                  />
                  <span className="text-sm text-gray-700">Create New Booking</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="bookingType"
                    checked={bookingType === 'existing'}
                    onChange={() => setBookingType('existing')}
                    className="text-[#007bff]"
                  />
                  <span className="text-sm text-gray-700">Add to Existing Booking</span>
                </label>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowBookingModal(false)}
                  className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    // Prepare the booking data
                    const bookingData = selectedPOs
                      .filter(po => po.selectedItems.size > 0)
                      .map(poSelection => ({
                        poId: poSelection.poId,
                        selectedItems: Array.from(poSelection.selectedItems),
                        bookedQuantities: poSelection.bookedQuantities
                      }));

                    if (bookingData.length === 0) return;

                    if (onCreateBooking) {
                      onCreateBooking(bookingData);
                    }
                    
                    setShowBookingModal(false);
                  }}
                  className="px-4 py-2 text-sm font-semibold text-white bg-[#007bff] rounded-lg hover:bg-blue-700"
                >
                  Create Booking
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const [expandedPO, setExpandedPO] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    search: '',
    status: 'All'
  });
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const statusDropdownRef = useRef<HTMLDivElement>(null);
  const statusButtonRef = useRef<HTMLButtonElement>(null);

 // Helper function to get line items for a PO with sequential numbering
  const getLineItemsForPO = (poId: string) => {
    const poNumber = parseInt(poId.replace('PO', ''));
    const items = poDetails
      .filter(item => item.poOrderNumber === poNumber)
      .map((item, index) => ({
        ...item,
        lineNumber: index + 1 // Add sequential line number
      }));
    return items;
  };

  // Helper function to count items in a PO
  const getItemCountForPO = (poId: string) => {
    const poNumber = parseInt(poId.replace('PO', ''));
    return poDetails.filter(item => item.poOrderNumber === poNumber).length;
  };

  const handleStatusChange = (poId: string, newStatus: string) => {
    setPurchaseOrders(prevOrders => 
      prevOrders.map(po => 
        po.id === poId ? { ...po, status: newStatus } : po
      )
    );
    
    // Close the dropdown
    setStatusDropdowns(prev => ({ ...prev, [poId]: false }));
  };

  const toggleStatusDropdown = (poId: string) => {
    setStatusDropdowns(prev => ({ 
      ...Object.keys(prev).reduce((acc, key) => ({ ...acc, [key]: false }), {}), // Close all others
      [poId]: !prev[poId] // Toggle current
    }));
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      
      // Handle main status filter dropdown
      if (statusDropdownRef.current && 
          !statusDropdownRef.current.contains(target) &&
          statusButtonRef.current && 
          !statusButtonRef.current.contains(target)) {
        setShowStatusDropdown(false);
      }
      
      // Handle individual status dropdowns
      setStatusDropdowns(prev => {
        const newState = { ...prev };
        let hasChanges = false;
        
        Object.keys(prev).forEach(poId => {
          if (prev[poId]) { // Only check if dropdown is open
            const ref = statusDropdownRefs.current[poId];
            const button = document.querySelector(`[data-dropdown-button="${poId}"]`) as Element;
            
            if (ref && !ref.contains(target) && 
                button && !button.contains(target)) {
              newState[poId] = false;
              hasChanges = true;
            }
          }
        });
        
        return hasChanges ? newState : prev;
      });
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []); 

  const handlePOItemSelect = (poId: string, itemId: number) => {
    setSelectedPOs(prev => {
      const existingPO = prev.find(po => po.poId === poId);
      const item = poDetails.find(item => item.id === itemId);
      if (!item) return prev;

      if (existingPO) {
        const newSelected = new Set(existingPO.selectedItems);
        const newBookedQuantities = { ...existingPO.bookedQuantities };

        if (newSelected.has(itemId)) {
          // Deselect
          newSelected.delete(itemId);
          delete newBookedQuantities[itemId];
        } else {
          // Select and set booked quantity to requested if not set or 0
          newSelected.add(itemId);
          if (!newBookedQuantities[itemId] || newBookedQuantities[itemId] === 0) {
            newBookedQuantities[itemId] = item.requested; // or 1 if you prefer
          }
        }

        return prev.map(po =>
          po.poId === poId
            ? { ...po, selectedItems: newSelected, bookedQuantities: newBookedQuantities }
            : po
        );
      }

      // New selection
      return [
        ...prev,
        {
          poId,
          selectedItems: new Set([itemId]),
          bookedQuantities: { [itemId]: item.requested } // or 1 if you prefer
        }
      ];
    });
  };

  const handleSelectAllPOItems = (poId: string) => {
    setSelectedPOs(prev => {
      const poNumber = parseInt(poId.replace('PO', ''));
      const poItems = poDetails
        .filter(item => item.poOrderNumber === poNumber)
        .map(item => item.id);
      
      // Always select all items (don't deselect if already selected)
      const bookedQuantities = poDetails
        .filter(item => item.poOrderNumber === poNumber)
        .reduce((acc, item) => {
          acc[item.id] = item.requested; // Set to max requested
          return acc;
        }, {} as Record<number, number>);
      
      // Show bulk actions and add to active POs
      setActiveBulkPOs(prev => {
        if (!prev.includes(poId)) {
          const newActivePOs = [...prev, poId];
          setShowBulkActions(true);
          return newActivePOs;
        }
        return prev;
      });
      
      return [
        ...prev.filter(po => po.poId !== poId),
        { 
          poId, 
          selectedItems: new Set(poItems),
          bookedQuantities 
        }
      ];
    });
  };

  const handleQuantityChange = (poId: string, itemId: number, quantity: number) => {
    setSelectedPOs(prev => {
      const existingPO = prev.find(po => po.poId === poId);
      const item = poDetails.find(item => item.id === itemId);
      
      if (!item) return prev;

      // Always update quantity, regardless of selection state
      if (existingPO) {
        return prev.map(po => {
          if (po.poId !== poId) return po;
          
          return {
            ...po,
            bookedQuantities: {
              ...po.bookedQuantities,
              [itemId]: quantity
            }
          };
        });
      }
      
      // If PO not tracked yet, create entry with this quantity
      return [...prev, { 
        poId, 
        selectedItems: new Set(), // Empty selection
        bookedQuantities: { [itemId]: quantity }
      }];
    });
  };
  
  const clearSelectionsForPO = (poId: string) => {
    setSelectedPOs(prev => prev.filter(po => po.poId !== poId));
    setActiveBulkPOs(prev => prev.filter(id => id !== poId));
    
    // Hide bulk actions if no POs are active
    setActiveBulkPOs(prev => {
      const newActivePOs = prev.filter(id => id !== poId);
      if (newActivePOs.length === 0) {
        setShowBulkActions(false);
        setShowBookingModal(false);
      }
      return newActivePOs;
    });
  };

  const getStatusDisplayText = (status: string) => {
    return status === 'All' ? 'All Status' : status;
  };

  const renderStatusFilterDropdown = () => {
    if (!showStatusDropdown) return null;
  
    const statusOptions = ['All', 'Open', 'Closed', 'Pending']; // Updated options
    
    return (
      <div 
        ref={statusDropdownRef}
        className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 w-40 max-h-80 overflow-hidden z-50"
      >
        <div className="p-2 max-h-64 overflow-y-auto">
          <div className="space-y-1">
            {statusOptions.map((status) => (
              <button
                key={status}
                onClick={() => {
                  setFilters({...filters, status});
                  setShowStatusDropdown(false);
                }}
                className={`w-full text-left p-2 hover:bg-gray-50 rounded cursor-pointer text-sm transition-colors ${
                  filters.status === status ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderStatusDropdown = (po: PurchaseOrder) => {
    const statusOptions = ['Open', 'Closed', 'Pending'];
    
    return (
      <td className="px-4 py-3 relative">
        <button
          data-dropdown-button={po.id} // Add this data attribute
          onClick={() => toggleStatusDropdown(po.id)}
          className="flex items-center gap-1 text-xs text-gray-900 hover:bg-gray-50 px-2 py-1 rounded transition-colors"
        >
          {po.status}
          <ChevronDown className={`w-3 h-3 text-gray-900 transition-transform ${statusDropdowns[po.id] ? 'rotate-180' : ''}`} />
        </button>
        
        {statusDropdowns[po.id] && (
          <div 
            ref={(el) => {
              statusDropdownRefs.current[po.id] = el;
            }}
            className="absolute mt-1 bg-white rounded-lg shadow-lg border border-gray-300 w-20 z-40"
          >
            <div className="p-1">
              {statusOptions.map((status) => (
                <button
                  key={status}
                  onClick={() => handleStatusChange(po.id, status)}
                  className={`w-full text-left p-2 hover:bg-gray-50 rounded cursor-pointer text-xs text-gray-900 transition-colors ${
                    po.status === status ? 'bg-blue-50' : ''
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        )}
      </td>
    );
  };

  const filteredPurchaseOrders = purchaseOrders.filter(po => {
    const matchesSearch = filters.search === '' || 
      po.id.toLowerCase().includes(filters.search.toLowerCase()) ||
      po.buyer.toLowerCase().includes(filters.search.toLowerCase()) ||
      po.seller.toLowerCase().includes(filters.search.toLowerCase()) ||
      po.subjectedCarrier.toLowerCase().includes(filters.search.toLowerCase()) ||
      po.exceptions.toLowerCase().includes(filters.search.toLowerCase());
    
    const matchesStatus = filters.status === 'All' || po.status === filters.status;
    
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredPurchaseOrders.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getTransportModeIcon = (mode: string) => {
    const modeColors: Record<string, string> = {
      'Sea': 'bg-blue-100 text-blue-800',
      'Air': 'bg-green-100 text-green-800',
      'Road': 'bg-purple-100 text-purple-800'
    };
    
    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${modeColors[mode] || 'bg-gray-100 text-gray-800'}`}>
        {mode}
      </span>
    );
  };

  const renderPagination = () => {
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, filteredPurchaseOrders.length);

    return (
      <div className="flex items-center justify-between px-4 py-3">
        <div className="text-sm text-gray-700">
          Showing {startItem} to {endItem} of {filteredPurchaseOrders.length} purchase orders
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={16} />
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i + 1}
              onClick={() => handlePageChange(i + 1)}
              className={`px-3 py-1 text-sm rounded ${
                currentPage === i + 1
                  ? 'bg-[#007bff] text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="">
      <div className="max-w-8xl mx-auto">
        {/* Only show header section in full view */}
        {/* Header */}
        <div className="mb-4">
          {/* Search and Filters */}
          <div className="flex gap-4 items-center mb-4">
            <div className="flex-1 max-w-md relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by PO, buyer, seller, carrier, or exceptions..."
                className="w-full pl-10 pr-4 p-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={filters.search}
                onChange={(e) => setFilters({...filters, search: e.target.value})}
              />
            </div>
            <div className="relative">
              <button
                ref={statusButtonRef}
                onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-900 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {getStatusDisplayText(filters.status)}
                <ChevronDown className={`w-4 h-4 transition-transform ${showStatusDropdown ? 'rotate-180' : ''}`} />
              </button>
              {renderStatusFilterDropdown()}
            </div>
          </div>
        </div>

        {/* Bulk Actions */}
        {showBulkActions && activeBulkPOs.length > 0 && (
          <div className="mt-4 p-3 bg-white rounded-lg border border-blue-200 mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 flex-wrap">
                {activeBulkPOs
                  .filter(poId => {
                    const selectedCount = selectedPOs.find(po => po.poId === poId)?.selectedItems.size || 0;
                    return selectedCount > 0;
                  })
                  .map(poId => {
                    const selectedCount = selectedPOs.find(po => po.poId === poId)?.selectedItems.size || 0;
                    return (
                      <div key={poId} className="flex items-center gap-1 bg-blue-100 rounded-full px-3 py-1 border border-gray-200">
                        <span className="text-sm font-medium text-gray-700">
                          {poId} ({selectedCount})
                        </span>
                        <button 
                          onClick={() => clearSelectionsForPO(poId)}
                          className="text-gray-400 hover:text-gray-600 ml-1"
                        >
                          <X className="w-3 h-3"/>
                        </button>
                      </div>
                    );
                  })}
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => {
                    setActiveBulkPOs([]);
                    setSelectedPOs([]);
                    setShowBulkActions(false);
                  }}
                  className="flex items-center gap-1 px-3 py-1 text-sm text-[#007bff] hover:text-blue-700"
                >
                  Clear All
                </button>
                {mode === 'standalone' ? (
                  <button 
                    onClick={() => {
                      const bookingData = selectedPOs
                        .filter(po => po.selectedItems.size > 0)
                        .map(poSelection => ({
                          poId: poSelection.poId,
                          selectedItems: Array.from(poSelection.selectedItems),
                          bookedQuantities: poSelection.bookedQuantities
                        }));
                          
                      if (bookingData.length > 0 && onCreateBooking) {
                        onCreateBooking(bookingData);
                        setActiveBulkPOs([]);
                        setSelectedPOs([]);
                        setShowBulkActions(false);
                      }
                    }}
                    className="flex items-center gap-1 px-4 py-2 text-sm text-white bg-[#007bff] rounded-lg shadow-sm hover:bg-blue-700"
                  >
                    Confirm Selection
                  </button>
                ) : (
                  <button 
                    onClick={() => setShowBookingModal(true)}
                    className="flex items-center gap-1 px-4 py-2 text-sm text-white bg-[#007bff] rounded-lg shadow-sm hover:bg-blue-700"
                  >
                    Review & Book
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Main Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">PO #</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Exceptions</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Cargo ready by</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Must arrive by</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Buyer</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Seller</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Subjected Carrier</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Progress</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredPurchaseOrders
                  .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                  .map((po) => (
                  <React.Fragment key={po.id}>
                    <tr className="hover:bg-gray-50">
                      <td className="py-3">
                        <div className="flex items-center">
                          <td className="px-4 py-3 text-xs font-medium text-gray-900">{po.id}</td>
                          <button
                            onClick={() => setExpandedPO(expandedPO === po.id ? null : po.id)}
                            className="p-1 -ml-2 hover:bg-gray-200 text-gray-900 rounded"
                          >
                            {expandedPO === po.id ? (
                              <ChevronDown className="w-3 h-3" />
                            ) : (
                              <ChevronRight className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-900">
                        {po.exceptions !== '--' ? (
                          <span className="px-2 py-1 bg-red-100 text-red-900 rounded-full text-xs">
                            {po.exceptions}
                          </span>
                        ) : (
                          '--'
                        )}
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-900">{formatDate(po.cargoReadyBy)}</td>
                      <td className="px-4 py-3 text-xs text-gray-900">{formatDate(po.mustArriveBy)}</td>
                      <td className="px-4 py-3 text-xs text-gray-900">{po.buyer}</td>
                      <td className="px-4 py-3 text-xs text-gray-900">{po.seller}</td>
                      <td className="px-4 py-3 text-xs text-gray-900">{po.subjectedCarrier}</td>
                      <td className="px-4 py-3 text-xs text-gray-900">{po.progress}</td>
                      {renderStatusDropdown(po)}
                      <td className="px-4 py-3">
                        <button 
                          onClick={() => onEditOrder(po.id)}  
                          className="p-1 text-gray-500 hover:text-gray-700 rounded"
                          title="Edit PO"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      </td> 
                    </tr>
                    
                    {/* Expanded PO Details */}
                    {expandedPO === po.id && (
                      <tr>
                        <td colSpan={10} className="p-4 bg-white">
                          <div className="space-y-4">
                            <div className="flex justify-between items-center">
                              <div>
                                <h3 className="text-sm font-semibold text-gray-900">PO {po.id}</h3>
                                <p className="text-xs text-gray-600">Updated: 20 days ago</p>
                              </div>
                            </div>
                            
                            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                              <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                  <tr>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Line #</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Product</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">CRD</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">MABD</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Mode</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Destination</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Currency</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Unit Cost</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">UoM</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Requested</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Booked</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                                      <div className="flex justify-end items-center">
                                        <button
                                          onClick={() => handleSelectAllPOItems(po.id)}
                                          className="flex items-center gap-1 px-3 py-1 text-xs rounded-sm border transition-colors bg-[#007bff] text-white border-[#007bff] hover:bg-blue-700"
                                        >
                                          <Plus className="w-3 h-3" />
                                          Add All
                                        </button>
                                      </div>
                                    </th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                  {getLineItemsForPO(po.id).map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50">
                                      <td className="px-4 py-3 text-xs text-gray-900">{item.lineNumber}</td>
                                      <td className="px-4 py-3">
                                        <div>
                                          <div className="text-xs font-medium text-gray-900">{item.productCode}</div>
                                          <div className="text-xs text-gray-500">{item.productName}</div>
                                        </div>
                                      </td>
                                      <td className="px-4 py-3 text-xs text-gray-600">{formatDate(item.cargoReadyDate)}</td>
                                      <td className="px-4 py-3 text-xs text-gray-600">{formatDate(item.mustArriveDate)}</td>
                                      <td className="px-4 py-3">{getTransportModeIcon(item.transportMode)}</td>
                                      <td className="px-4 py-3 text-xs text-gray-600">{item.destination}</td>
                                      <td className="px-4 py-3 text-xs text-gray-600">{item.currency}</td>
                                      <td className="px-4 py-3 text-xs text-gray-600">{item.unitCost}</td>
                                      <td className="px-4 py-3 text-xs text-gray-600">{item.uom}</td>
                                      <td className="px-4 py-3 text-xs text-gray-600">{item.requested}</td>
                                      <td className="px-4 py-3">
                                        <div className="text-xs text-gray-900">
                                          {selectedPOs.some(selectedPO => selectedPO.poId === po.id && selectedPO.selectedItems.has(item.id))
                                            ? selectedPOs.find(selectedPO => selectedPO.poId === po.id)?.bookedQuantities?.[item.id] || 0
                                            : 0
                                          }
                                        </div>
                                        <div className="text-xs text-gray-500">
                                          ({selectedPOs.some(selectedPO => selectedPO.poId === po.id && selectedPO.selectedItems.has(item.id))
                                            ? Math.round(((selectedPOs.find(selectedPO => selectedPO.poId === po.id)?.bookedQuantities?.[item.id] || 0) / item.requested) * 100)
                                            : 0
                                          }%)
                                        </div>
                                      </td>
                                      <td className="px-4 py-3">
                                        <div className="flex items-center justify-end gap-2">
                                          <input
                                            type="number"
                                            min="0"
                                            max={item.requested}
                                            value={
                                              selectedPOs.find(po => po.poId === `PO${item.poOrderNumber}`)
                                                ?.bookedQuantities[item.id] ?? 0
                                            }
                                            onChange={(e) => {
                                              const value = Math.max(0, Math.min(
                                                Number(e.target.value) || 0,
                                                item.requested
                                              ));
                                              handleQuantityChange(`PO${item.poOrderNumber}`, item.id, value);
                                            }}
                                            className="w-16 p-1 text-xs text-gray-900 border border-gray-300 rounded-sm"
                                            onFocus={(e) => e.target.select()}
                                          />
                                          <button
                                              onClick={() => handlePOItemSelect(`PO${item.poOrderNumber}`, item.id)}
                                              className={`flex items-center justify-center w-6 h-6 text-xs rounded border transition-colors ${
                                                selectedPOs.some(po => 
                                                  po.poId === `PO${item.poOrderNumber}` && 
                                                  po.selectedItems.has(item.id)
                                                )
                                                  ? 'bg-[#007bff] text-white border-[#007bff] hover:bg-blue-700'
                                                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-200'
                                              }`}
                                            >
                                              <Check className="w-3 h-3" />
                                          </button>
                                        </div>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {renderPagination()}
          
        {filteredPurchaseOrders.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No purchase orders found
          </div>
        )}
      </div>

      {renderBookingModal()}
    
    </div>
  );
};

export default POManagement;
