import axios from 'axios';

const COURSE_API_URL = `${process.env.REACT_APP_BACKEND_URL}/auth`;
const apiAuth = axios.create({
    baseURL: COURSE_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const loginUser = async (email, password) => {
    try {
        const data = {
            email: email,
            password: password,
        };

        const response = await apiAuth.post("/login", data);
        console.log("Login Response:", response.data);
        return response.data;
    } catch (error) {
        console.error("Login Error:", error.response?.data || error.message);
        throw error;
    }
};

export const getUserInfo = async (accessToken) => {
    try {
        const response = await apiAuth.get("/me", {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        console.log("User Info Response:", response.data);
        return response.data;
    } catch (error) {
        console.error("Get User Info Error:", error.response?.data || error.message);
        throw error;
    }
};

export const getAllUsers = async (accessToken) => {
    try {
        const response = await apiAuth.get("/users", {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        console.log("All Users Response:", response.data);
        return response.data;
    } catch (error) {
        console.error("Get All Users Error:", error.response?.data || error.message);
        throw error;
    }
};

export const updateRoleUser = async (accessToken, user_id, role) => {
    try {
        const response = await apiAuth.put(
            `/users/${user_id}`, 
            { role }, 
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
            }
        );
        console.log("Update Role Response:", response.data);
        return response.data;
    } catch (error) {
        console.error("Update Role Error:", error.response?.data || error.message);
        throw error;
    }
};

export const deleteUser = async (accessToken, user_id) => {
    try {
        const response = await apiAuth.delete(
            `/users/${user_id}`, 
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
            }
        );
        console.log("Delete User Response:", response.data);
        return response.data;
    } catch (error) {
        console.error("Delete User Error:", error.response?.data || error.message);
        throw error;
    }
};
