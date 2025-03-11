import React, { createContext, useContext, useState, useEffect } from 'react';
const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        
        if (token) {
          // const response = await fetch('/api/validate-token', { ... });
          
          setCurrentUser({
            id: 1,
            name: 'Người dùng',
            email: 'user@example.com',
            avatar: null,
          });
          setIsAuthenticated(true);
        } else {
          setCurrentUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Lỗi xác thực:', error);
        setCurrentUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      // const response = await fetch('/api/login', { ... });
      
      const mockUser = {
        id: 1,
        name: 'Người dùng',
        email,
        avatar: null,
      };
      
      localStorage.setItem('auth_token', 'mock_token_example');
      
      setCurrentUser(mockUser);
      setIsAuthenticated(true);
      return { success: true };
    } catch (error) {
      console.error('Lỗi đăng nhập:', error);
      return { success: false, error: 'Đăng nhập thất bại' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  const register = async (name, email, password) => {
    setIsLoading(true);
    try {
      // const response = await fetch('/api/register', { ... });
      
      return { success: true };
    } catch (error) {
      console.error('Lỗi đăng ký:', error);
      return { success: false, error: 'Đăng ký thất bại' };
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    currentUser,
    isAuthenticated,
    isLoading,
    login,
    logout,
    register
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;