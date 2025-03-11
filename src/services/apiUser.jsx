import axios from 'axios';

const USER_API_URL = `${process.env.REACT_APP_BACKEND_URL}/users`;

const apiUser = axios.create({
  baseURL: USER_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getAllUsers = async () => {
  try {
    const response = await apiUser.get('/');
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách người dùng:', error);
    throw error;
  }
};

export const getUserById = async (id) => {
  try {
    const response = await apiUser.get(`/${id}`);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy thông tin người dùng:', error);
    throw error;
  }
};

export const createUser = async (userData) => {
  try {
    const response = await apiUser.post('/', userData);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi tạo người dùng:', error);
    throw error;
  }
};

export const updateUser = async (id, userData) => {
  try {
    const response = await apiUser.put(`/${id}`, userData);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi cập nhật người dùng:', error);
    throw error;
  }
};

export const deleteUser = async (id) => {
  try {
    const response = await apiUser.delete(`/${id}`);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi xóa người dùng:', error);
    throw error;
  }
};
