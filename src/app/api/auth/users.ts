export type User = {
  id: string;
  username: string;
  password: string; // Plaintext for demo only! Use hashing in production.
  role: 'client' | 'forwarder' | 'logisticsprovider' | 'admin';
};

const users: User[] = [
  {
    id: 'admin-1',
    username: 'admin@freightlynk.com',
    password: 'admin123',
    role: 'admin',
  },
];

export function addUser(user: User) {
  users.push(user);
}

export function findUserByUsername(username: string): User | undefined {
  return users.find(u => u.username === username);
}

export function validateUser(username: string, password: string): User | undefined {
  return users.find(u => u.username === username && u.password === password);
}

export function getUserById(id: string): User | undefined {
  return users.find(u => u.id === id);
} 