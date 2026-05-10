import axios from 'axios';

const API = import.meta.env.VITE_API_BASE_URL || '/api';

export const activityService = {
  getActivities: async (params) => {
    const { data } = await axios.get(`${API}/activities`, { params });
    return data;
  },
  getActivity: async (id) => {
    const { data } = await axios.get(`${API}/activities/${id}`);
    return data;
  },
  getCities: async (params) => {
    const { data } = await axios.get(`${API}/cities`, { params });
    return data;
  },
  getCity: async (id) => {
    const { data } = await axios.get(`${API}/cities/${id}`);
    return data;
  },
};
