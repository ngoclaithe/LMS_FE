import axios from 'axios';

const LESSON_API_URL = `${process.env.REACT_APP_BACKEND_URL}/lessons`;

const apiLesson = axios.create({
    baseURL: LESSON_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const getAllLessons = async () => {
    try {
        const response = await apiLesson.get('/');
        return response.data;
    } catch (error) {
        console.error('Lỗi khi lấy danh sách bài giảng:', error);
        throw error;
    }
};

export const getLessonById = async (id) => {
    try {
        const response = await apiLesson.get(`/${id}`);
        return response.data;
    } catch (error) {
        console.error('Lỗi khi lấy thông tin bài giảng:', error);
        throw error;
    }
};

export const getLessonByIdCourse = async (id) => {
    try {
        const response = await apiLesson.get(`/courses/${id}`);
        return response.data;
    } catch (error) {
        console.error('Lỗi khi lấy thông tin bài giảng khóa học:', error);
        throw error;
    }
};

export const createLesson = async (lessonData) => {
    try {
        const response = await apiLesson.post('/', lessonData);
        return response.data;
    } catch (error) {
        console.error('Lỗi khi tạo bài giảng:', error);
        throw error;
    }
};

export const updateLesson = async (id, lessonData) => {
    try {
        const response = await apiLesson.put(`/${id}`, lessonData);
        return response.data;
    } catch (error) {
        console.error('Lỗi khi cập nhật bài giảng:', error);
        throw error;
    }
};

export const deleteLesson = async (id) => {
    try {
        const response = await apiLesson.delete(`/${id}`);
        return response.data;
    } catch (error) {
        console.error('Lỗi khi xóa bài giảng:', error);
        throw error;
    }
};
