// Mock data for ecosystem groups
export interface EcosystemGroup {
  id: number;
  name: string;
  members: number;
  type: string;
  lastActivity: string;
  color: string;
  status?: 'active' | 'inactive' | 'pending';
}

export const ecosystemGroups: EcosystemGroup[] = [
  {
    id: 1,
    name: "Asia-Pacific Trade",
    members: 15,
    type: "Regional",
    lastActivity: "2 hours ago",
    color: "bg-blue-500",
    status: "active"
  },
  {
    id: 2,
    name: "Electronics Supply Chain",
    members: 23,
    type: "Industry",
    lastActivity: "1 day ago",
    color: "bg-green-500",
    status: "active"
  },
  {
    id: 3,
    name: "EU Compliance Network",
    members: 12,
    type: "Regulatory",
    lastActivity: "3 hours ago",
    color: "bg-purple-500",
    status: "pending"
  },
  {
    id: 4,
    name: "Cold Chain Alliance",
    members: 8,
    type: "Specialized",
    lastActivity: "5 hours ago",
    color: "bg-cyan-500",
    status: "active"
  },
  {
    id: 5,
    name: "North American Logistics",
    members: 19,
    type: "Regional",
    lastActivity: "1 hour ago",
    color: "bg-red-500",
    status: "inactive"
  },
  {
    id: 6,
    name: "Automotive Supply Chain",
    members: 27,
    type: "Industry",
    lastActivity: "2 days ago",
    color: "bg-yellow-500",
    status: "active"
  }
]; 