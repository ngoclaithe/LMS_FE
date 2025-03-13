import axios from 'axios';

const COURSE_API_URL = `${process.env.REACT_APP_BACKEND_URL}/courses`;

const apiCourse = axios.create({
    baseURL: COURSE_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const getAllCourses = async () => {
    try {
        const response = await apiCourse.get('/');
        return response.data;
    } catch (error) {
        console.error('Lỗi khi lấy danh sách khóa học:', error);
        throw error;
    }
};

export const get5CourseByCourseType = async (course_type) => {
    try {
        const response = await apiCourse.get(`/type/${course_type}/limit5`);
        return response.data;
    } catch (error) {
        console.error('Lỗi khi lấy 5 khóa học theo loại:', error);
        throw error;
    }
};

export const getAllCoursesByCourseType = async (course_type) => {
    try {
        const response = await apiCourse.get(`/type/${course_type}`);
        return response.data;
    } catch (error) {
        console.error('Lỗi khi lấy danh sách khóa học theo loại:', error);
        throw error;
    }
};
export const getAllCoursesByCourseName = async (course_name) => {
    try {
        const response = await apiCourse.get(`/name/${course_name}`);
        return response.data;
    } catch (error) {
        console.error('Lỗi khi lấy danh sách khóa học theo tên:', error);
        throw error;
    }
};
export const getCourseById = async (id) => {
    try {
        const response = await apiCourse.get(`/${id}`);
        return response.data;
    } catch (error) {
        console.error('Lỗi khi lấy thông tin khóa học:', error);
        throw error;
    }
};

export const createCourse = async (courseData) => {
    try {
        const response = await apiCourse.post('/', courseData);
        return response.data;
    } catch (error) {
        console.error('Lỗi khi tạo khóa học:', error);
        throw error;
    }
};

export const updateCourse = async (id, courseData) => {
    try {
        const response = await apiCourse.put(`/${id}`, courseData);
        return response.data;
    } catch (error) {
        console.error('Lỗi khi cập nhật khóa học:', error);
        throw error;
    }
};

export const deleteCourse = async (id) => {
    try {
        const response = await apiCourse.delete(`/${id}`);
        return response.data;
    } catch (error) {
        console.error('Lỗi khi xóa khóa học:', error);
        throw error;
    }
};

