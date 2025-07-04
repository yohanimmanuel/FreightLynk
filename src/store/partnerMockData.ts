// Mock data for partner directory
export interface Partner {
  id: number;
  name: string;
  type: string;
  status: string;
  industry: string;
  lastContact: string;
  avatar: string;
}

export const partnerDirectory: Partner[] = [
  {
    id: 1,
    name: "Oceanic Freight Services",
    type: "Forwarder",
    status: "Active",
    industry: "Maritime",
    lastContact: "2 days ago",
    avatar: "OF"
  },
  {
    id: 2,
    name: "TechCorp Manufacturing",
    type: "Client",
    status: "Active",
    industry: "Electronics",
    lastContact: "1 week ago",
    avatar: "TC"
  },
  {
    id: 3,
    name: "Regional Customs Agency",
    type: "Provider",
    status: "Pending",
    industry: "Customs",
    lastContact: "3 days ago",
    avatar: "RC"
  },
  {
    id: 4,
    name: "Express Air Cargo",
    type: "Provider",
    status: "Active",
    industry: "Air Freight",
    lastContact: "1 day ago",
    avatar: "EA"
  },
  {
    id: 5,
    name: "Global Trade Solutions",
    type: "Forwarder",
    status: "Active",
    industry: "Multi-modal",
    lastContact: "4 hours ago",
    avatar: "GT"
  },
  {
    id: 6,
    name: "Pacific Logistics Co.",
    type: "Forwarder",
    status: "Active",
    industry: "Maritime",
    lastContact: "1 day ago",
    avatar: "PL"
  },
  {
    id: 7,
    name: "Global Exports Inc.",
    type: "Client",
    status: "Active",
    industry: "Export/Import",
    lastContact: "3 days ago",
    avatar: "GE"
  },
  {
    id: 8,
    name: "Customs Solutions",
    type: "Provider",
    status: "Active",
    industry: "Customs",
    lastContact: "5 days ago",
    avatar: "CS"
  }
];

// Mock data for recent messages
export interface Message {
  id: number;
  sender: string;
  message: string;
  time: string;
  unread: boolean;
  avatar: string;
}

export const recentMessages: Message[] = [
  {
    id: 1,
    sender: "Pacific Logistics Co.",
    message: "Can we schedule a call to discuss the Q4 rates?",
    time: "2 hours ago",
    unread: true,
    avatar: "PL"
  },
  {
    id: 2,
    sender: "Global Exports Inc.",
    message: "Documents are ready for shipment GL-2024-001",
    time: "1 day ago",
    unread: false,
    avatar: "GE"
  },
  {
    id: 3,
    sender: "Customs Solutions",
    message: "Clearance completed for container MSKU-789456",
    time: "2 days ago",
    unread: true,
    avatar: "CS"
  }
];

// Mock data for business stats
export const businessStats = {
  totalPartners: 47,
  totalEcosystems: 8,
  pendingInvites: 5,
  connectionRequests: 12,
  messagesUnread: 3
}; 