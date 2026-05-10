import axios from 'axios';

const API = import.meta.env.VITE_API_BASE_URL || '/api';

export const tripService = {
  getTrips: async () => {
    const { data } = await axios.get(`${API}/trips`);
    return data;
  },
  getTrip: async (id) => {
    const { data } = await axios.get(`${API}/trips/${id}`);
    return data;
  },
  createTrip: async (tripData) => {
    const { data } = await axios.post(`${API}/trips`, tripData);
    return data;
  },
  updateTrip: async (id, tripData) => {
    const { data } = await axios.put(`${API}/trips/${id}`, tripData);
    return data;
  },
  deleteTrip: async (id) => {
    const { data } = await axios.delete(`${API}/trips/${id}`);
    return data;
  },
  getPublicTrip: async (id) => {
    const { data } = await axios.get(`${API}/trips/public/${id}`);
    return data;
  },
  togglePublic: async (id) => {
    const { data } = await axios.patch(`${API}/trips/${id}/toggle-public`);
    return data;
  },
};
