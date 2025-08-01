export interface QuoteRequest {
  id: string;
  request_id: string;
  user_id: string;
  forwarder_user_id?: string;
  booking_id?: string;
  customer_name: string;
  commodities: string;
  details: string;
  origin: string;
  destination: string;
  cargo_ready_date: string;
  target_delivery_date: string;
  attachment: string;
  status: 'pending' | 'quoted' | 'accepted' | 'rejected' | 'cancelled';
  incoterms: string;
  created_by: string;
  created_on: string;
  mode: string;
  notes?: string;
  provider?: string;
  transit_time?: string;
  quoted_amount?: number;
  quoted_currency?: string;
  quoted_valid_until?: string;
  created_at: string;
  updated_at: string;
}

export interface QuoteRequestFilters {
  role?: 'client' | 'forwarder';
  mode?: string;
  status?: string;
  search?: string;
}

// Fetch quote requests with optional filters
export const fetchQuoteRequests = async (filters: QuoteRequestFilters = {}): Promise<QuoteRequest[]> => {
  try {
    const params = new URLSearchParams();
    
    if (filters.role) params.append('role', filters.role);
    if (filters.mode) params.append('mode', filters.mode);
    if (filters.status) params.append('status', filters.status);
    if (filters.search) params.append('search', filters.search);

    const response = await fetch(`/api/quote-requests?${params.toString()}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching quote requests:', error);
    throw error;
  }
};

// Create a new quote request
export const createQuoteRequest = async (quoteRequest: Partial<QuoteRequest>): Promise<{ success: boolean; id: string; message: string }> => {
  try {
    const response = await fetch('/api/quote-requests', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(quoteRequest),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating quote request:', error);
    throw error;
  }
};

// Update an existing quote request
export const updateQuoteRequest = async (id: string, updates: Partial<QuoteRequest>): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await fetch('/api/quote-requests', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, ...updates }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating quote request:', error);
    throw error;
  }
};

// Delete a quote request
export const deleteQuoteRequest = async (id: string): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await fetch(`/api/quote-requests?id=${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error deleting quote request:', error);
    throw error;
  }
};

// Convert booking to quote request format
export const formatBookingToQuoteRequest = (booking: any, role: 'client' | 'forwarder' = 'client'): Partial<QuoteRequest> => {
  // Determine mode for tab and icon
  let mode = '';
  if (booking.transportModeValue === 'sea') {
    mode = booking.shipmentTypeValue?.toLowerCase() === 'fcl' ? 'FCL' : 'LCL';
  } else if (booking.transportModeValue === 'air') {
    mode = 'AIR';
  } else if (booking.transportModeValue === 'land') {
    mode = booking.shipmentTypeValue?.toLowerCase() === 'ftl' ? 'FTL' : 'LTL';
  }

  // Build details string with proper format
  let details = '';
  
  if (booking.transportModeValue === 'sea' && booking.shipmentTypeValue?.toLowerCase() === 'fcl') {
    // For FCL, use container types array if available, otherwise fallback to single values
    let containerTypesArray = booking.containerTypes;
    if (typeof booking.containerTypes === 'string') {
      try {
        containerTypesArray = JSON.parse(booking.containerTypes);
      } catch (e) {
        containerTypesArray = [];
      }
    }
    
    if (containerTypesArray && Array.isArray(containerTypesArray) && containerTypesArray.length > 0) {
      details = containerTypesArray.map((ct: any) => `${ct.quantity || ''} x ${ct.type || ''}`).join(', ');
    } else {
      details = `${booking.containerQuantity || ''} x ${booking.containerTypeValue || ''}`;
    }
  } else if (booking.transportModeValue === 'land' && booking.shipmentTypeValue?.toLowerCase() === 'ftl') {
    // For FTL, use truck types array if available, otherwise fallback to single values
    let truckTypesArray = booking.truckTypes;
    if (typeof booking.truckTypes === 'string') {
      try {
        truckTypesArray = JSON.parse(booking.truckTypes);
      } catch (e) {
        truckTypesArray = [];
      }
    }
    
    if (truckTypesArray && Array.isArray(truckTypesArray) && truckTypesArray.length > 0) {
      details = truckTypesArray.map((tt: any) => `${tt.quantity || ''} x ${tt.type || ''}`).join(', ');
    } else {
      details = `${booking.truckQuantity || ''} x ${booking.truckType || ''}`;
    }
  } else {
    // For LCL/AIR/LTL: weight kg/volume cbm
    details = (booking.weight && booking.volume) ? `${booking.weight}kg/${booking.volume}cbm` : booking.weight ? `${booking.weight}kg` : booking.volume ? `${booking.volume}cbm` : '';
  }

  return {
    request_id: booking.bookingId || `QR-${Date.now()}`,
    customer_name: booking.shipperValue || 'Demo User',
    commodities: booking.productName || '',
    details,
    origin: booking.originPort || '',
    destination: booking.destinationPort || '',
    cargo_ready_date: booking.cargoReadyDate || '',
    target_delivery_date: booking.eta || '',
    attachment: booking.attachment || 'No attached file',
    status: 'pending',
    incoterms: booking.incoterms || '',
    created_by: 'Demo User',
    created_on: new Date().toLocaleDateString('en-CA'),
    mode,
    notes: booking.additionalNotes || '',
    booking_id: booking.bookingId,
  };
};

// Format quote request for display
export const formatQuoteRequestForDisplay = (quoteRequest: QuoteRequest): any => {
  return {
    id: quoteRequest.request_id,
    customer: quoteRequest.customer_name,
    provider: quoteRequest.provider || '',
    details: quoteRequest.details,
    origin: quoteRequest.origin,
    destination: quoteRequest.destination,
    cargoReadyDate: quoteRequest.cargo_ready_date,
    expectedDelivery: quoteRequest.target_delivery_date,
    attachment: quoteRequest.attachment,
    status: quoteRequest.status === 'pending' ? 'Pending' : 
            quoteRequest.status === 'quoted' ? 'Quoted' :
            quoteRequest.status === 'accepted' ? 'Accepted' :
            quoteRequest.status === 'rejected' ? 'Rejected' :
            quoteRequest.status === 'cancelled' ? 'Cancelled' : 'Pending',
    incoterms: quoteRequest.incoterms,
    remark: '', // Always blank for client
    createdBy: quoteRequest.created_by,
    createdOn: quoteRequest.created_on,
    mode: quoteRequest.mode?.toLowerCase(),
    notes: quoteRequest.notes || '',
    commodities: quoteRequest.commodities,
    transitTime: quoteRequest.transit_time,
  };
}; 