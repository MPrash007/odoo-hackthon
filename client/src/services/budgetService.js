import axios from 'axios';

const API = import.meta.env.VITE_API_BASE_URL || '/api';

export const budgetService = {
  getBudget: async (tripId) => {
    const { data } = await axios.get(`${API}/budget/trip/${tripId}`);
    return data;
  },
};

export const checklistService = {
  getChecklist: async (tripId) => {
    const { data } = await axios.get(`${API}/checklists/trip/${tripId}`);
    return data;
  },
  addItem: async (tripId, item) => {
    const { data } = await axios.post(`${API}/checklists/trip/${tripId}`, item);
    return data;
  },
  toggleItem: async (itemId, updates) => {
    const { data } = await axios.patch(`${API}/checklists/${itemId}`, updates);
    return data;
  },
  deleteItem: async (itemId) => {
    const { data } = await axios.delete(`${API}/checklists/${itemId}`);
    return data;
  },
  resetChecklist: async (tripId) => {
    const { data } = await axios.delete(`${API}/checklists/trip/${tripId}/reset`);
    return data;
  },
};

export const notesService = {
  getNotes: async (tripId) => {
    const { data } = await axios.get(`${API}/notes/trip/${tripId}`);
    return data;
  },
  addNote: async (tripId, note) => {
    const { data } = await axios.post(`${API}/notes/trip/${tripId}`, note);
    return data;
  },
  updateNote: async (noteId, updates) => {
    const { data } = await axios.put(`${API}/notes/${noteId}`, updates);
    return data;
  },
  deleteNote: async (noteId) => {
    const { data } = await axios.delete(`${API}/notes/${noteId}`);
    return data;
  },
};

export const adminService = {
  getStats: async () => {
    const { data } = await axios.get(`${API}/admin/stats`);
    return data;
  },
  getUsers: async () => {
    const { data } = await axios.get(`${API}/admin/users`);
    return data;
  },
  deleteUser: async (id) => {
    const { data } = await axios.delete(`${API}/admin/users/${id}`);
    return data;
  },
  getAllTrips: async () => {
    const { data } = await axios.get(`${API}/admin/trips`);
    return data;
  },
};
