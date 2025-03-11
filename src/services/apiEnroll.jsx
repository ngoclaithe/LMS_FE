import axios from 'axios';

const USER_API_URL = `${process.env.REACT_APP_BACKEND_URL}/enroll`;

const apiEnroll = axios.create({
  baseURL: USER_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const enrollCourse = async (enrollmentData) => {
  try {
    const response = await apiEnroll.post('/', enrollmentData);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi đăng ký:', error);
    throw error;
  }
};
