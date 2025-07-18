// Mock data for partner directory
export interface Partner {
  id: number;
  name: string;
  type: string;
  status: string;
  industry: string;
  lastContact: string;
  avatar: string;
  // Company info (Card 1)
  address: string;
  operatingRegions: string[];
  specializations: string[];
  workingHours: string;
  website: string;
  email: string;
  phone: string;
  // Business info (Card 2)
  connectedSince: string;
  activeBookings: number;
  latestShipment: {
    id: string;
    date: string;
    status: string;
  };
  paymentTerms: string;
  rating: number;
  // Contact persons (Card 3)
  contactPersons: {
    id: number;
    name: string;
    initials: string;
    role: string;
    isAdmin: boolean;
    email: string;
    phone: string;
  }[];
}

export const partnerDirectory: Partner[] = [
  {
    id: 1,
    name: "Oceanic Freight Services",
    type: "Forwarder",
    status: "Active",
    industry: "Maritime",
    lastContact: "2 days ago",
    avatar: "OF",
    // Company info
    address: "123 Harbor Avenue, Singapore 123456",
    operatingRegions: ["Asia Pacific", "Europe", "North America"],
    specializations: ["Ocean Freight", "Air Freight", "Customs Clearance"],
    workingHours: "Mon-Fri: 9:00 AM - 6:00 PM",
    website: "www.oceanicfreight.com",
    email: "info@oceanicfreight.com",
    phone: "+65 6123 4567",
    // Business info
    connectedSince: "Jan 2023",
    activeBookings: 8,
    latestShipment: {
      id: "SHP-2024-0432",
      date: "2024-04-20",
      status: "In Transit"
    },
    paymentTerms: "Net 30",
    rating: 4.7,
    // Contact persons
    contactPersons: [
      {
        id: 1,
        name: "James Wilson",
        initials: "JW",
        role: "Account Manager",
        isAdmin: true,
        email: "james.wilson@oceanicfreight.com",
        phone: "+65 9123 4567"
      },
      {
        id: 2,
        name: "Emily Chen",
        initials: "EC",
        role: "Operations Specialist",
        isAdmin: false,
        email: "emily.chen@oceanicfreight.com",
        phone: "+65 9234 5678"
      },
      {
        id: 3,
        name: "John Smith",
        initials: "JS",
        role: "Customer Service",
        isAdmin: false,
        email: "john.doe@oceanicfreight.com",
        phone: "+65 9345 6789"
      },
      {
        id: 4,
        name: "Jane Doe",
        initials: "JD",
        role: "Customer Service",
        isAdmin: false,
        email: "jane.doe@oceanicfreight.com",
        phone: "+65 9456 7890"
      }
    ]
  },
  {
    id: 2,
    name: "TechCorp Manufacturing",
    type: "Client",
    status: "Active",
    industry: "Electronics",
    lastContact: "1 week ago",
    avatar: "TC",
    // Company info
    address: "456 Tech Park Road, Shenzhen, China",
    operatingRegions: ["Asia", "North America"],
    specializations: ["Electronics", "Consumer Goods"],
    workingHours: "Mon-Sat: 8:00 AM - 5:00 PM",
    website: "www.techcorpmfg.com",
    email: "contact@techcorpmfg.com",
    phone: "+86 755 1234 5678",
    // Business info
    connectedSince: "Mar 2023",
    activeBookings: 3,
    latestShipment: {
      id: "SHP-2024-0389",
      date: "2024-04-15",
      status: "Delivered"
    },
    paymentTerms: "Net 45",
    rating: 4.5,
    // Contact persons
    contactPersons: [
      {
        id: 1,
        name: "David Zhang",
        initials: "DZ",
        role: "Logistics Manager",
        isAdmin: true,
        email: "david.zhang@techcorpmfg.com",
        phone: "+86 139 1234 5678"
      }
    ]
  },
  {
    id: 3,
    name: "Regional Customs Agency",
    type: "Provider",
    status: "Pending",
    industry: "Customs",
    lastContact: "3 days ago",
    avatar: "RC",
    // Company info
    address: "789 Government Road, Jakarta, Indonesia",
    operatingRegions: ["Southeast Asia"],
    specializations: ["Customs Clearance", "Documentation", "Compliance"],
    workingHours: "Mon-Fri: 8:30 AM - 4:30 PM",
    website: "www.regionalcustoms.gov.id",
    email: "info@regionalcustoms.gov.id",
    phone: "+62 21 1234 5678",
    // Business info
    connectedSince: "Feb 2024",
    activeBookings: 5,
    latestShipment: {
      id: "SHP-2024-0412",
      date: "2024-04-18",
      status: "Customs Clearance"
    },
    paymentTerms: "Net 15",
    rating: 4.2,
    // Contact persons
    contactPersons: [
      {
        id: 1,
        name: "Siti Nurhayati",
        initials: "SN",
        role: "Customs Officer",
        isAdmin: true,
        email: "siti.nurhayati@regionalcustoms.gov.id",
        phone: "+62 812 3456 7890"
      },
      {
        id: 2,
        name: "Budi Santoso",
        initials: "BS",
        role: "Documentation Specialist",
        isAdmin: false,
        email: "budi.santoso@regionalcustoms.gov.id",
        phone: "+62 813 4567 8901"
      }
    ]
  },
  {
    id: 4,
    name: "Global Electronics Ltd.",
    type: "Client",
    status: "Active",
    industry: "Consumer Electronics",
    lastContact: "3 days ago",
    avatar: "GE",
    address: "789 Innovation Drive, Seoul, South Korea",
    operatingRegions: ["Asia", "Europe"],
    specializations: ["Smartphones", "Tablets"],
    workingHours: "Mon-Fri: 9:00 AM - 6:00 PM",
    website: "www.globalelectronics.com",
    email: "info@globalelectronics.com",
    phone: "+82 2-123-4567",
    connectedSince: "Feb 2022",
    activeBookings: 5,
    latestShipment: {
      id: "SHP-2024-0450",
      date: "2024-04-22",
      status: "Delivered"
    },
    paymentTerms: "Net 30",
    rating: 4.6,
    contactPersons: [
      {
        id: 1,
        name: "Minji Kim",
        initials: "MK",
        role: "Procurement Manager",
        isAdmin: true,
        email: "minji.kim@globalelectronics.com",
        phone: "+82 10-2345-6789"
      }
    ]
  },
  {
    id: 5,
    name: "Continental Textiles",
    type: "Client",
    status: "Active",
    industry: "Textiles",
    lastContact: "5 days ago",
    avatar: "CT",
    address: "321 Cotton Lane, Mumbai, India",
    operatingRegions: ["Asia", "Europe", "Africa"],
    specializations: ["Fabrics", "Garments"],
    workingHours: "Mon-Sat: 8:00 AM - 6:00 PM",
    website: "www.continentaltextiles.com",
    email: "contact@continentaltextiles.com",
    phone: "+91 22-3344-5566",
    connectedSince: "May 2021",
    activeBookings: 7,
    latestShipment: {
      id: "SHP-2024-0460",
      date: "2024-04-25",
      status: "In Transit"
    },
    paymentTerms: "Net 60",
    rating: 4.4,
    contactPersons: [
      {
        id: 1,
        name: "Rajesh Kumar",
        initials: "RK",
        role: "Export Manager",
        isAdmin: true,
        email: "rajesh.kumar@continentaltextiles.com",
        phone: "+91 90000 12345"
      }
    ]
  },
];