import { v4 as uuidv4 } from 'uuid';
import { addUser as dbAddUser, findUserByUsername as dbFindUserByUsername, validateUser as dbValidateUser, getUserById as dbGetUserById } from './userDb';

export type UserRole = 'client' | 'forwarder' | 'logisticsprovider' | 'admin';

export interface User {
  id: string;
  username: string;
  password: string; // Plaintext for demo only! Use hashing in production.
  fullName?: string;
  companyName?: string;
  companyAddress?: string;
  companyWebsite?: string;
  companySize?: string;
  userType?: string;
  otherUserType?: string;
  businessOperations?: string;
  goodsTypes?: string;
  shippingFrequency?: string;
  primaryRoutes?: string;
  jobTitle?: string;
  phone?: string;
  role: UserRole;
  createdAt?: string;
  updatedAt?: string;
}

// Initialize admin user if it doesn't exist
const initAdminUser = () => {
  const adminExists = dbFindUserByUsername('admin@freightlynk.com');
  if (!adminExists) {
    dbAddUser({
      id: 'admin-1',
      username: 'admin@freightlynk.com',
      password: 'admin123', // In production, hash this password
      role: 'admin' as const,
      fullName: 'Admin User',
      companyName: 'FreightLynk',
      companyAddress: '',
      companyWebsite: '',
      companySize: '',
      userType: '',
      otherUserType: '',
      businessOperations: '',
      goodsTypes: '',
      shippingFrequency: '',
      primaryRoutes: '',
      jobTitle: '',
      phone: ''
    });
    console.log('Admin user created');
  }
};

// Do NOT run the initialization automatically at module load
// Run initAdminUser() manually from a setup script or server startup if needed
export const ensureAdminUser = initAdminUser;

export function addUser(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): User {
  const user = {
    ...userData,
    id: uuidv4()
  };
  
  return dbAddUser(user);
}

export function findUserByUsername(username: string): User | undefined {
  return dbFindUserByUsername(username);
}

export function validateUser(username: string, password: string): User | undefined {
  return dbValidateUser(username, password);
}

export function getUserById(id: string): User | undefined {
  return dbGetUserById(id);
}