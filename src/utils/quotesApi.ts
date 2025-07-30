import { Quote } from '@/store/forwarderquote';

// API functions for quotes
export const getQuotes = async (mode?: string, status?: string): Promise<Quote[]> => {
  try {
    let url = '/api/quotes';
    const params = new URLSearchParams();
    if (mode) params.append('mode', mode);
    if (status) params.append('status', status);
    if (params.toString()) url += `?${params.toString()}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch quotes');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching quotes:', error);
    throw error;
  }
};

export const getQuote = async (id: string): Promise<Quote> => {
  try {
    const response = await fetch(`/api/quotes?id=${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch quote');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching quote:', error);
    throw error;
  }
};

export const createQuote = async (quote: Partial<Quote>): Promise<{ success: boolean; id: string; message: string }> => {
  try {
    const response = await fetch('/api/quotes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(quote),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create quote');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating quote:', error);
    throw error;
  }
};

export const updateQuote = async (id: string, quote: Partial<Quote>): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await fetch(`/api/quotes?id=${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(quote),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update quote');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error updating quote:', error);
    throw error;
  }
};

export const deleteQuote = async (id: string): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await fetch(`/api/quotes?id=${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete quote');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error deleting quote:', error);
    throw error;
  }
};

export const submitQuote = async (id: string): Promise<{ success: boolean; message: string }> => {
  return updateQuote(id, { status: 'sent' });
};

export const acceptQuote = async (id: string): Promise<{ success: boolean; message: string }> => {
  return updateQuote(id, { status: 'accepted' });
};

export const rejectQuote = async (id: string): Promise<{ success: boolean; message: string }> => {
  return updateQuote(id, { status: 'rejected' });
}; 