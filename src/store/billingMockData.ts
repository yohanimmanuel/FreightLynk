// billingData.ts - shared billing data for BillingTable and BillingDetails

export const billingData = [
  {
    id: 1,
    bookingId: 'FL-42581',
    issuer: 'Maersk Line',
    billingDate: '2024-06-15',
    amountDue: 1250.00,
    status: 'Unpaid',
    invoiceNumber: 'INV-2024-001',
    dueDate: '2024-07-15',
    currency: 'USD',
    paymentMethod: 'Credit Card',
    paymentDate: null,
    invoiceNotes: 'Standard freight charges for container shipment from Shanghai to Los Angeles',
    charges: [
      { type: 'Freight Base Rate', description: 'Main transport cost', amount: 800.00 },
      { type: 'Fuel Surcharge', description: 'Fuel fluctuation fee', amount: 150.00 },
      { type: 'Handling Fee', description: 'Port/container handling', amount: 75.00 },
      { type: 'Documentation Fee', description: 'Admin and B/L docs', amount: 25.00 },
      { type: 'Insurance', description: 'Optional cargo protection', amount: 50.00 },
      { type: 'Customs Fee', description: 'Clearance service fee', amount: 150.00 }
    ],
    paymentHistory: []
  },
  {
    id: 2,
    bookingId: 'FL-42582',
    issuer: 'DB Schenker',
    billingDate: '2024-06-10',
    amountDue: 980.50,
    status: 'Paid',
    invoiceNumber: 'INV-2024-002',
    dueDate: '2024-07-10',
    currency: 'USD',
    paymentMethod: 'Bank Transfer',
    paymentDate: '2024-06-25',
    invoiceNotes: 'Express delivery service with priority handling',
    charges: [
      { type: 'Freight Base Rate', description: 'Main transport cost', amount: 650.00 },
      { type: 'Express Surcharge', description: 'Priority handling fee', amount: 200.00 },
      { type: 'Fuel Surcharge', description: 'Fuel fluctuation fee', amount: 80.50 },
      { type: 'Documentation Fee', description: 'Admin and B/L docs', amount: 25.00 },
      { type: 'Insurance', description: 'Optional cargo protection', amount: 25.00 }
    ],
    paymentHistory: [
      { date: '2024-06-25', amount: 980.50, method: 'Bank Transfer', status: 'Completed' }
    ]
  },
  {
    id: 3,
    bookingId: 'FL-42583',
    issuer: 'DHL Global',
    billingDate: '2024-05-20',
    amountDue: 1850.75,
    status: 'Overdue',
    invoiceNumber: 'INV-2024-003',
    dueDate: '2024-06-20',
    currency: 'USD',
    paymentMethod: 'Credit Card',
    paymentDate: null,
    invoiceNotes: 'High-value cargo with additional security measures and insurance coverage',
    charges: [
      { type: 'Freight Base Rate', description: 'Main transport cost', amount: 1200.00 },
      { type: 'High-Value Surcharge', description: 'Special handling for valuable cargo', amount: 300.00 },
      { type: 'Security Fee', description: 'Enhanced security measures', amount: 150.00 },
      { type: 'Fuel Surcharge', description: 'Fuel fluctuation fee', amount: 100.75 },
      { type: 'Insurance', description: 'Premium cargo protection', amount: 75.00 },
      { type: 'Documentation Fee', description: 'Admin and B/L docs', amount: 25.00 }
    ],
    paymentHistory: []
  },
  {
    id: 4,
    bookingId: 'FL-42584',
    issuer: 'Kuehne + Nagel',
    billingDate: '2024-06-18',
    amountDue: 750.00,
    status: 'Failed',
    invoiceNumber: 'INV-2024-004',
    dueDate: '2024-07-18',
    currency: 'USD',
    paymentMethod: 'Credit Card',
    paymentDate: null,
    invoiceNotes: 'Payment failed due to insufficient funds. Please update payment method.',
    charges: [
      { type: 'Freight Base Rate', description: 'Main transport cost', amount: 500.00 },
      { type: 'Fuel Surcharge', description: 'Fuel fluctuation fee', amount: 75.00 },
      { type: 'Handling Fee', description: 'Port/container handling', amount: 100.00 },
      { type: 'Documentation Fee', description: 'Admin and B/L docs', amount: 25.00 },
      { type: 'Customs Fee', description: 'Clearance service fee', amount: 50.00 }
    ],
    paymentHistory: [
      { date: '2024-06-30', amount: 750.00, method: 'Credit Card', status: 'Failed' }
    ]
  },
  {
    id: 5,
    bookingId: 'FL-42585',
    issuer: 'COSCO Shipping',
    billingDate: '2024-06-22',
    amountDue: 1420.25,
    status: 'Unpaid',
    invoiceNumber: 'INV-2024-005',
    dueDate: '2024-07-22',
    currency: 'USD',
    paymentMethod: 'Bank Transfer',
    paymentDate: null,
    invoiceNotes: 'Large container shipment with temperature-controlled transport',
    charges: [
      { type: 'Freight Base Rate', description: 'Main transport cost', amount: 900.00 },
      { type: 'Reefer Surcharge', description: 'Temperature-controlled transport', amount: 350.00 },
      { type: 'Fuel Surcharge', description: 'Fuel fluctuation fee', amount: 120.25 },
      { type: 'Documentation Fee', description: 'Admin and B/L docs', amount: 25.00 },
      { type: 'Insurance', description: 'Optional cargo protection', amount: 25.00 }
    ],
    paymentHistory: []
  },
  {
    id: 6,
    bookingId: 'FL-42586',
    issuer: 'Expeditors',
    billingDate: '2024-06-25',
    amountDue: 890.00,
    status: 'Paid',
    invoiceNumber: 'INV-2024-006',
    dueDate: '2024-07-25',
    currency: 'USD',
    paymentMethod: 'Credit Card',
    paymentDate: '2024-07-01',
    invoiceNotes: 'Air freight service with expedited customs clearance',
    charges: [
      { type: 'Air Freight Rate', description: 'Air transport cost', amount: 650.00 },
      { type: 'Expedited Clearance', description: 'Fast customs processing', amount: 150.00 },
      { type: 'Fuel Surcharge', description: 'Fuel fluctuation fee', amount: 65.00 },
      { type: 'Documentation Fee', description: 'Admin and B/L docs', amount: 25.00 }
    ],
    paymentHistory: [
      { date: '2024-07-01', amount: 890.00, method: 'Credit Card', status: 'Completed' }
    ]
  },
  {
    id: 7,
    bookingId: 'FL-42587',
    issuer: 'CMA CGM',
    billingDate: '2024-06-28',
    amountDue: 1650.80,
    status: 'Unpaid',
    invoiceNumber: 'INV-2024-007',
    dueDate: '2024-07-28',
    currency: 'USD',
    paymentMethod: 'Bank Transfer',
    paymentDate: null,
    invoiceNotes: 'Multi-modal transport with rail and ocean freight combination',
    charges: [
      { type: 'Ocean Freight Rate', description: 'Ocean transport cost', amount: 800.00 },
      { type: 'Rail Transport', description: 'Inland rail transport', amount: 450.00 },
      { type: 'Intermodal Fee', description: 'Multi-modal coordination', amount: 200.00 },
      { type: 'Fuel Surcharge', description: 'Fuel fluctuation fee', amount: 150.80 },
      { type: 'Documentation Fee', description: 'Admin and B/L docs', amount: 25.00 },
      { type: 'Insurance', description: 'Optional cargo protection', amount: 25.00 }
    ],
    paymentHistory: []
  }
]; 