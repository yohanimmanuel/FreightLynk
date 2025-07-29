import { Rate } from '@/store/forwarderquote';

const API_BASE = '/api/rates';

export interface RatesApiResponse {
  success?: boolean;
  error?: string;
  id?: number;
}

export const ratesApi = {
  // Get all rates for current user
  async getRates(mode?: string): Promise<Rate[]> {
    try {
      const url = mode ? `${API_BASE}?mode=${mode}` : API_BASE;
      const response = await fetch(url, {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching rates:', error);
      throw error;
    }
  },

  // Get specific rate by ID
  async getRate(id: number): Promise<Rate> {
    try {
      const response = await fetch(`${API_BASE}?id=${id}`, {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching rate:', error);
      throw error;
    }
  },

  // Create new rate
  async createRate(rate: Rate): Promise<RatesApiResponse> {
    try {
      const response = await fetch(API_BASE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(rate),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error creating rate:', error);
      throw error;
    }
  },

  // Update existing rate
  async updateRate(id: number, rate: Rate): Promise<RatesApiResponse> {
    try {
      const response = await fetch(`${API_BASE}?id=${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(rate),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error updating rate:', error);
      throw error;
    }
  },

  // Delete rate
  async deleteRate(id: number): Promise<RatesApiResponse> {
    try {
      const response = await fetch(`${API_BASE}?id=${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error deleting rate:', error);
      throw error;
    }
  },

  // Bulk delete rates
  async deleteRates(ids: number[]): Promise<RatesApiResponse[]> {
    try {
      const promises = ids.map(id => this.deleteRate(id));
      const results = await Promise.all(promises);
      return results;
    } catch (error) {
      console.error('Error bulk deleting rates:', error);
      throw error;
    }
  },
}; 