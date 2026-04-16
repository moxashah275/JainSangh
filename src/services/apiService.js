import api from '../api/axios';

export const apiService = {
  // Generic GET request
  get: async (url, params = {}) => {
    try {
      const response = await api.get(url, { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Generic POST request
  post: async (url, data = {}) => {
    try {
      const response = await api.post(url, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Generic PUT request
  put: async (url, data = {}) => {
    try {
      const response = await api.put(url, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Generic DELETE request
  delete: async (url) => {
    try {
      const response = await api.delete(url);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

// Example specific service for Members
export const memberService = {
  getMembers: () => apiService.get('members/'),
  getMember: (id) => apiService.get(`members/${id}/`),
  createMember: (data) => apiService.post('members/', data),
  updateMember: (id, data) => apiService.put(`members/${id}/`, data),
  deleteMember: (id) => apiService.delete(`members/${id}/`),
};

// Authentication Service
export const authService = {
  login: async (credentials) => {
    // Calling the exact endpoint provided by the user
    const response = await api.post('v1/auth/login/', credentials);
    return response.data;
  },
  getProfile: () => apiService.get('v1/accounts/users/me/'),
};

// User Management Service
export const userService = {
  getUsers: () => apiService.get('v1/accounts/users/'),
  getUser: (id) => apiService.get(`v1/accounts/users/${id}/`),
  createUser: (data) => apiService.post('v1/accounts/users/', data),
  updateUser: (id, data) => apiService.put(`v1/accounts/users/${id}/`, data),
  deleteUser: (id) => apiService.delete(`v1/accounts/users/${id}/`),
  getActivities: () => apiService.get('v1/activities/'),
  getDocuments: () => apiService.get('v1/documents/'),
};

// Organization Management Service
export const orgService = {
  getTrusts: () => apiService.get('v1/org/trusts/'),
  getSanghs: () => apiService.get('v1/org/sanghs/'),
  getDepartments: () => apiService.get('v1/org/departments/'),
};

// Location Management Service
export const locationService = {
  getLocations: () => apiService.get('v1/locations/'),
  getLocation: (id) => apiService.get(`v1/locations/${id}/`),
  createLocation: (data) => apiService.post('v1/locations/', data),
  updateLocation: (id, data) => apiService.put(`v1/locations/${id}/`, data),
  deleteLocation: (id) => apiService.delete(`v1/locations/${id}/`),
  batchUpdate: (data) => apiService.post('v1/locations/batch/', data),
};

// Sangh Administration Service
export const sanghService = {
  getDetails: (id) => apiService.get(`v1/sangh/${id}/`),
  updateDetails: (id, data) => apiService.put(`v1/sangh/${id}/`, data),
  getLinkedTrusts: (id) => apiService.get(`v1/sangh/${id}/trusts/`),
  getCommitteeMembers: (sanghId) => apiService.get(`v1/sangh/contact/`, { sangh: sanghId }),
  updateTrust: (id, data) => apiService.put(`v1/trusts/${id}/`, data),
  removeTrust: (id) => apiService.delete(`v1/trusts/${id}/`),
};
