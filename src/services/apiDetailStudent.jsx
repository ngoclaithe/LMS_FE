import axios from 'axios';

const DETAIL_STUDENT_API_URL = `${process.env.REACT_APP_BACKEND_URL}/detailstudents`;

const apiDetailStudent = axios.create({
  baseURL: DETAIL_STUDENT_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getAllDetailStudents = async () => {
  try {
    const response = await apiDetailStudent.get('/');
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách chi tiết sinh viên:', error);
    throw error;
  }
};

export const getDetailStudentById = async (id_student) => {
  try {
    const response = await apiDetailStudent.get(`/${id_student}`);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy thông tin chi tiết sinh viên:', error);
    throw error;
  }
};

export const createDetailStudent = async (studentData, token) => {
  try {
    const response = await apiDetailStudent.post('/', studentData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Lỗi khi tạo thông tin chi tiết sinh viên:', error);
    throw error;
  }
};

export const updateDetailStudent = async (id_student, studentData, token) => {
  try {
    const response = await apiDetailStudent.put(`/${id_student}`, studentData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Lỗi khi cập nhật thông tin chi tiết sinh viên:', error);
    throw error;
  }
};

export const deleteDetailStudent = async (id_student, token) => {
  try {
    const response = await apiDetailStudent.delete(`/${id_student}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Lỗi khi xoá thông tin chi tiết sinh viên:', error);
    throw error;
  }
};

export default apiDetailStudent;