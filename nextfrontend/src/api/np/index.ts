import type { NPCity, NPWarehouse } from '../../types';

export const novaPoshtaApi = {
  async searchSettlements(cityName: string): Promise<NPCity[]> {
    const q = cityName.trim();
    if (q.length < 2) return [];

    const res = await fetch(`/api/np/cities?q=${encodeURIComponent(q)}`, { cache: 'no-store' });
    const data = await res.json();
    return data.cities || [];
  },

  async getWarehouses(cityRef: string): Promise<NPWarehouse[]> {
    if (!cityRef) return [];

    const res = await fetch(`/api/np/warehouses?cityRef=${encodeURIComponent(cityRef)}`, {
      cache: 'no-store',
    });
    const data = await res.json();
    return data.warehouses || [];
  },
};
