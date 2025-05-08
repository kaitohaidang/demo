import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

// Cấu hình axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Xử lý lỗi chung
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error("API Error:", error.response ? error.response.data : error.message);
    return Promise.reject(error);
  }
);

// API đăng nhập
export const authAPI = {
  login: async (username, password) => {
    try {
      const response = await api.post('http://localhost:8080/api/auth/login', { username, password });
      // Lưu thông tin user vào localStorage
      localStorage.setItem('user', JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  logout: () => {
    localStorage.removeItem('user');
  },
  
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  }
};

// API quản lý xe
export const vehicleAPI = {
  getAllVehicles: async () => {
    const user = authAPI.getCurrentUser();
    if (!user) throw new Error("Người dùng chưa đăng nhập");
    
    return api.get(`http://localhost:8080/api/vehicles?userId=${user.id}&role=${user.role}`);
  },
  
  getVehicleById: async (id) => {
    return api.get(`http://localhost:8080/api/vehicles/${id}`);
  },
  
  createVehicle: async (vehicleData) => {
    const user = authAPI.getCurrentUser();
    if (!user) throw new Error("Người dùng chưa đăng nhập");
    
    return api.post(`http://localhost:8080/api/vehicles?userId=${user.id}`, vehicleData);
  },
  
  updateVehicle: async (id, vehicleData) => {
    return api.put(`http://localhost:8080/api/vehicles/${id}`, vehicleData);
  },
  
  deleteVehicle: async (id) => {
    return api.delete(`http://localhost:8080/api/vehicles/${id}`);
  }
};

// eslint-disable-next-line import/no-anonymous-default-export
export default { authAPI, vehicleAPI };