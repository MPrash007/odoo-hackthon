import axios from 'axios';

const API = import.meta.env.VITE_API_BASE_URL || '/api';

export const authService = {
  getMe: async () => {
    const { data } = await axios.get(`${API}/auth/me`);
    return data;
  },
  updateMe: async (updates) => {
    const { data } = await axios.put(`${API}/auth/me`, updates);
    return data;
  },
  deleteMe: async () => {
    const { data } = await axios.delete(`${API}/auth/me`);
    return data;
  },
};
