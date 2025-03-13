import axios from 'axios';

const DOCUMENT_API_URL = `${process.env.REACT_APP_BACKEND_URL}/documents`;

const apiDocument = axios.create({
    baseURL: DOCUMENT_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const getAllDocuments = async () => {
    try {
        const response = await apiDocument.get('/');
        return response.data;
    } catch (error) {
        console.error('Lỗi khi lấy danh sách tài liệu:', error);
        throw error;
    }
};

export const getDocumentById = async (id) => {
    try {
        const response = await apiDocument.get(`/${id}`);
        return response.data;
    } catch (error) {
        console.error('Lỗi khi lấy thông tin tài liệu:', error);
        throw error;
    }
};
export const getDocumentByIdLesson = async (id) => {
    try {
        const response = await apiDocument.get(`/lessons/${id}`);
        return response.data;
    } catch (error) {
        console.error('Lỗi khi lấy thông tin tài liệu:', error);
        throw error;
    }
};
export const createDocument = async (documentData) => {
    try {
        const response = await apiDocument.post('/', documentData);
        return response.data;
    } catch (error) {
        console.error('Lỗi khi tạo tài liệu:', error);
        throw error;
    }
};

export const updateDocument = async (id, documentData) => {
    try {
        const response = await apiDocument.put(`/${id}`, documentData);
        return response.data;
    } catch (error) {
        console.error('Lỗi khi cập nhật tài liệu:', error);
        throw error;
    }
};

export const deleteDocument = async (id) => {
    try {
        const response = await apiDocument.delete(`/${id}`);
        return response.data;
    } catch (error) {
        console.error('Lỗi khi xóa tài liệu:', error);
        throw error;
    }
};
