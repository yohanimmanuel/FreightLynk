export async function register(
  username: string,
  password: string,
  role: 'client' | 'forwarder' | 'logisticsprovider',
  fullName: string,
  companyName: string,
  companyAddress?: string,
  companyWebsite?: string,
  companySize?: string,
  userType?: string,
  otherUserType?: string,
  businessOperations?: string,
  goodsTypes?: string,
  shippingFrequency?: string,
  primaryRoutes?: string,
  jobTitle?: string,
  phone?: string
) {
  const res = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username,
      password,
      role,
      fullName,
      companyName,
      companyAddress,
      companyWebsite,
      companySize,
      userType,
      otherUserType,
      businessOperations,
      goodsTypes,
      shippingFrequency,
      primaryRoutes,
      jobTitle,
      phone
    }),
  });
  return res.json();
}

export async function login(username: string, password: string) {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  return res.json();
}

export async function logout() {
  const res = await fetch('/api/auth/logout', {
    method: 'POST' });
  return res.json();
}

export async function getCurrentUser() {
  const res = await fetch('/api/auth/me');
  return res.json();
} 