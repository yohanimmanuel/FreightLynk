import axios from 'axios';
import { PurchaseOrder, PODetail } from '@/store/poStore';

const API_BASE = '/api/purchaseorders';

// Fetch all purchase orders
export async function fetchPurchaseOrders(): Promise<PurchaseOrder[]> {
  const res = await axios.get(API_BASE);
  return res.data;
}

// Fetch PO details for a specific PO
export async function fetchPODetails(poId: string): Promise<PODetail[]> {
  const res = await axios.get(`${API_BASE}/${poId}/details`);
  return res.data;
}

// Create a new purchase order
export async function createPurchaseOrder(po: Partial<PurchaseOrder>): Promise<PurchaseOrder> {
  const res = await axios.post(API_BASE, po);
  return res.data;
}

// Update an existing purchase order
export async function updatePurchaseOrder(poId: string, po: Partial<PurchaseOrder>): Promise<PurchaseOrder> {
  const res = await axios.put(`${API_BASE}/${poId}`, po);
  return res.data;
}

// Delete a purchase order
export async function deletePurchaseOrder(poId: string): Promise<void> {
  await axios.delete(`${API_BASE}/${poId}`);
}

// Create or update PO details
export async function upsertPODetails(poId: string, details: PODetail[]): Promise<PODetail[]> {
  const res = await axios.put(`${API_BASE}/${poId}/details`, details);
  return res.data;
}
